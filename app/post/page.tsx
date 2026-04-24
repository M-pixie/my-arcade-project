"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import CreateSwagPost from "@/app/components/CreateSwagPost";
// ================= FIREBASE IMPORTS =================
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "firebase/firestore";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

export default function PostFeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<{postId: string, commentId: string, name: string} | null>(null);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Edit feature ke liye state
  const [postToEdit, setPostToEdit] = useState<any>(null);

  // ================= FIREBASE FETCH =================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "swag_posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Click outside handler for comments and menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (activeMenuId && !target.closest('.menu-container')) setActiveMenuId(null);
      
      const targetCommentSection = target.closest('.comments-section');
      const targetCommentButton = target.closest('.comment-button');
      
      if (!targetCommentSection && !targetCommentButton) {
        setExpandedComments({});
        setReplyingTo(null); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  // ================= FIREBASE ADD / EDIT POST =================
  const handleNewOrEditPost = async (postData: any, isEdit: boolean) => {
    try {
      if (isEdit) {
        // Firebase Update
        const postRef = doc(db, "swag_posts", postData.id);
        await updateDoc(postRef, postData);
        
        // UI Update
        setPosts(prev => prev.map(p => p.id === postData.id ? { ...p, ...postData } : p));
        setSystemAlert("Post updated successfully!");
      } else {
        // Formatted completely new post for Firebase
        const newDbPost = {
          name: postData.name,
          title: postData.title,
          about: postData.about,
          image: postData.image, // Base64 string
          createdAt: postData.createdAt,
          likes: 0,
          reposts: 0,
          shares: 0,
          commentsData: []
        };
        
        // Firebase Add
        const docRef = await addDoc(collection(db, "swag_posts"), newDbPost);
        
        // UI Update
        const finalPost = { id: docRef.id, ...newDbPost, hasLiked: false, hasReposted: false };
        setPosts(prev => [finalPost, ...prev]);
      }
    } catch (error) {
      console.error("Firebase save error:", error);
      setSystemAlert("Failed to save post. Check Firebase connection.");
    }
    
    setTimeout(() => setSystemAlert(null), 3000);
  };

  // ================= FIREBASE DELETE =================
  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "swag_posts", id));
      setPosts(prev => prev.filter(post => post.id !== id));
      setSystemAlert("Post deleted successfully.");
    } catch (error) {
      console.error("Firebase delete error:", error);
      setSystemAlert("Failed to delete post.");
    }
    setActiveMenuId(null);
    setTimeout(() => setSystemAlert(null), 3000);
  };

  const editPost = (post: any) => {
    setPostToEdit(post);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // ================= FIREBASE LIKE / REPOST =================
  const handleAction = async (id: string, action: 'like' | 'repost') => {
    // Optimistic UI Update
    let newLikeCount = 0;
    let newRepostCount = 0;

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === id) {
        if (action === 'like') {
          newLikeCount = post.hasLiked ? post.likes - 1 : post.likes + 1;
          return { ...post, likes: newLikeCount, hasLiked: !post.hasLiked };
        }
        if (action === 'repost') {
          newRepostCount = post.hasReposted ? post.reposts - 1 : post.reposts + 1;
          return { ...post, reposts: newRepostCount, hasReposted: !post.hasReposted };
        }
      }
      return post;
    }));

    // Update real DB quietly
    try {
      const postRef = doc(db, "swag_posts", id);
      if (action === 'like') await updateDoc(postRef, { likes: newLikeCount });
      if (action === 'repost') await updateDoc(postRef, { reposts: newRepostCount });
    } catch (err) {
       console.error("Action update failed", err);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    setReplyingTo(null); 
  };

  // ================= FIREBASE COMMENT =================
  const submitComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    let updatedCommentsArray: any[] = [];

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = [...post.commentsData];
        if (replyingTo && replyingTo.postId === postId) {
          const commentIndex = updatedComments.findIndex(c => c.id === replyingTo.commentId);
          if (commentIndex > -1) {
            updatedComments[commentIndex].replies.push({ id: Date.now().toString(), name: "Manish Kumar", text: text, time: new Date().toISOString() });
          }
        } else {
          updatedComments.push({ id: Date.now().toString(), name: "Manish Kumar", text: text, time: new Date().toISOString(), replies: [] });
        }
        updatedCommentsArray = updatedComments;
        return { ...post, commentsData: updatedComments };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    setReplyingTo(null);

    // Save comments to DB
    try {
      const postRef = doc(db, "swag_posts", postId);
      await updateDoc(postRef, { commentsData: updatedCommentsArray });
    } catch (err) {
       console.error("Comment save failed", err);
    }
  };

  // ================= NATIVE UNIVERSAL SHARE =================
  const shareToAll = async (post: any) => {
    const textToShare = `Check out this awesome swag post by ${post.name}: "${post.title}"\n\n`;
    const urlToShare = "https://arcade-calculator.vercel.app/post";

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Swag Achievement',
          text: textToShare,
          url: urlToShare
        });
        
        // Increment share count in DB
        const newShares = (post.shares || 0) + 1;
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, shares: newShares } : p));
        await updateDoc(doc(db, "swag_posts", post.id), { shares: newShares });

      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback if browser doesn't support native share
      navigator.clipboard.writeText(urlToShare);
      setSystemAlert("Link copied to clipboard!");
      setTimeout(() => setSystemAlert(null), 3000);
    }
  };

  const openNewPostModal = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans pb-16 relative">
      <Navbar />
      
      {systemAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#202124] text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-fade-in-up">
          <svg className="w-4 h-4 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          {systemAlert}
        </div>
      )}

      <main className="max-w-[540px] mx-auto px-4 pt-24 space-y-5">
        
        {/* CREATE POST BANNER */}
        <div className="bg-white/90 backdrop-blur-sm p-4 border border-[#dadce0] rounded-xl shadow-sm flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-bold shrink-0">M</div>
           <button 
             onClick={openNewPostModal}
             className="flex-grow bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368] text-left px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
           >
             Share your latest swag achievement...
           </button>
           <button 
             onClick={openNewPostModal}
             className="shrink-0 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
             Add Post
           </button>
        </div>

        <div className="space-y-5">
          {loading ? (
             <div className="text-center text-[#1a73e8] font-bold py-16">Loading Posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-[#5f6368] py-16 bg-white border border-[#dadce0] rounded-xl shadow-sm">
              <span className="text-4xl mb-3 block">📭</span>
              <h3 className="font-bold text-[#202124]">No posts yet</h3>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-visible flex flex-col">
                
                <div className="px-4 py-3 flex items-center gap-3 relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#4285f4] flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {post.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-bold text-[#202124] text-[15px] leading-tight">
                      {post.name}
                    </h3>
                    <span className="text-[#80868b] text-[12px] font-medium mt-0.5">{timeAgo(post.createdAt)} • Community</span>
                  </div>
                  
                  {/* Menu */}
                  <div className="ml-auto relative menu-container">
                     <button onClick={() => setActiveMenuId(prev => prev === post.id ? null : post.id)} className="text-[#80868b] hover:bg-[#f1f3f4] p-1.5 rounded-full transition-colors">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                     </button>
                     {activeMenuId === post.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-[#dadce0] py-1 z-20 overflow-hidden">
                           <button onClick={() => editPost(post)} className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#5f6368] hover:bg-[#f8f9fa] border-b border-[#f1f3f4] transition-colors">
                             Edit Post
                           </button>
                           <button onClick={() => deletePost(post.id)} className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#ea4335] hover:bg-[#fce8e6] transition-colors">
                             Delete Post
                           </button>
                        </div>
                     )}
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <h4 className="font-black text-[#202124] text-[16px] leading-snug mb-1">{post.title}</h4>
                  {post.about && <p className="text-[#3c4043] text-[14px] leading-relaxed">{post.about}</p>}
                </div>

                <div className="w-full bg-[#f8f9fa] border-t border-b border-[#dadce0] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full max-h-[550px] object-cover" />
                </div>

                <div className="px-3 py-1.5 flex items-center justify-between gap-1 border-b border-[#f1f3f4]">
                  {/* RED HEART LIKE BUTTON */}
                  <button onClick={() => handleAction(post.id, 'like')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors font-bold text-[13px] ${post.hasLiked ? 'text-[#ea4335] bg-[#fce8e6]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}>
                    <svg className="w-5 h-5" fill={post.hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Like {post.likes > 0 && post.likes}
                  </button>

                  <button onClick={() => toggleComments(post.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors font-bold text-[13px] comment-button ${expandedComments[post.id] ? 'text-[#1a73e8] bg-[#e8f0fe]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Comment {post.commentsData?.length > 0 && post.commentsData.length}
                  </button>
                  
                  <button onClick={() => handleAction(post.id, 'repost')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors font-bold text-[13px] ${post.hasReposted ? 'text-[#34a853] bg-[#e6f4ea]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Repost {post.reposts > 0 && post.reposts}
                  </button>

                  {/* NATIVE SHARE BUTTON */}
                  <button onClick={() => shareToAll(post)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors font-bold text-[13px] text-[#5f6368] hover:bg-[#f1f3f4]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Share {post.shares > 0 && post.shares}
                  </button>
                </div>

                {/* EXPANDABLE COMMENTS SECTION */}
                {expandedComments[post.id] && (
                  <div className="bg-[#f8f9fa] px-4 py-4 rounded-b-xl comments-section">
                    
                    <div className="flex gap-2 mb-4 relative">
                      <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5">M</div>
                      <div className="flex-grow bg-white border border-[#dadce0] rounded-xl px-3 py-2 focus-within:border-[#1a73e8] transition-colors shadow-sm relative">
                        {replyingTo?.postId === post.id && (
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-1 rounded mb-1 w-fit">
                            Replying to {replyingTo.name}
                            <button onClick={() => setReplyingTo(null)} className="hover:text-red-500">×</button>
                          </div>
                        )}
                        <input 
                          type="text" 
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                          placeholder="Add a comment..." 
                          className="w-full text-[14px] outline-none bg-transparent"
                          onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                        />
                      </div>
                      <button onClick={() => submitComment(post.id)} className="text-[#1a73e8] font-bold text-sm px-2 hover:bg-[#e8f0fe] rounded-lg transition-colors">
                        Post
                      </button>
                    </div>

                    <div className="space-y-4">
                      {post.commentsData?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fbbc04] to-[#f29900] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {comment.name.charAt(0)}
                          </div>
                          <div className="flex-grow">
                            <div className="bg-white px-3 py-2 rounded-xl rounded-tl-none border border-[#dadce0] shadow-sm inline-block max-w-[90%]">
                              <h5 className="font-bold text-[#202124] text-[13px]">{comment.name}</h5>
                              <p className="text-[#3c4043] text-[13px] mt-0.5">{comment.text}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 pl-2 text-[11px] font-bold text-[#80868b]">
                              <span>{timeAgo(comment.time)}</span>
                              <button onClick={() => setReplyingTo({postId: post.id, commentId: comment.id, name: comment.name})} className="hover:text-[#202124] transition-colors">Reply</button>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-2 space-y-3">
                                {comment.replies.map((reply: any) => (
                                  <div key={reply.id} className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#4285f4] flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-1">
                                      {reply.name.charAt(0)}
                                    </div>
                                    <div className="flex-grow">
                                      <div className="bg-white px-3 py-2 rounded-xl rounded-tl-none border border-[#dadce0] shadow-sm inline-block max-w-[95%]">
                                        <h5 className="font-bold text-[#202124] text-[12px]">{reply.name} <span className="text-[#1a73e8] ml-1 bg-[#e8f0fe] px-1 rounded text-[9px]">Author</span></h5>
                                        <p className="text-[#3c4043] text-[13px] mt-0.5">{reply.text}</p>
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 pl-2 text-[11px] font-bold text-[#80868b]">
                                        <span>{timeAgo(reply.time)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <CreateSwagPost 
          editData={postToEdit} // Pass existing data if editing
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleNewOrEditPost} // Call updated Firebase function
        />
      )}
    </div>
  );
}