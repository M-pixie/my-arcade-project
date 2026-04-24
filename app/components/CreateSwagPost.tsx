"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Confetti from 'react-confetti';

// editData prop add kiya hai for editing existing posts
export default function CreateSwagPost({ onClose, onSuccess, editData }: { onClose: () => void, onSuccess: (post: any, isEdit: boolean) => void, editData?: any }) {
  // Agar edit mode hai, to purana data load karo
  const [name, setName] = useState(editData ? editData.name : "");
  const [title, setTitle] = useState(editData ? editData.title : "");
  const [about, setAbout] = useState(editData ? editData.about : "");
  const imgRef = useRef<HTMLImageElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null); 
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  
  // Agar edit hai to purani image load hogi
  const [croppedImageBase64, setCroppedImageBase64] = useState<string | null>(editData ? editData.image : null); 
  
  const [isCropping, setIsCropping] = useState(false); 
  const [imageRemovedPop, setImageRemovedPop] = useState(false); 
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false); 
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 }); 

  const [newPostData, setNewPostData] = useState<any>(null);

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, [postSuccess]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCroppedImageBase64(null); 
      setErrorMsg(null); 
      
      const reader = new FileReader(); 
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropping(true); 
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (imageRemovedPop) {
      const timer = setTimeout(() => setImageRemovedPop(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [imageRemovedPop]);

  const removeImage = () => {
    setCroppedImageBase64(null);
    setImageRemovedPop(true);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return "";
    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
    return canvas.toDataURL('image/png'); 
  };

  const handleSkipCrop = () => {
    setCroppedImageBase64(imageSrc); 
    setIsCropping(false); 
  };

  const handleConfirmCrop = useCallback(() => {
    if (imgRef.current && completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      const croppedUrl = getCroppedImg(imgRef.current, completedCrop);
      setCroppedImageBase64(croppedUrl);
      setIsCropping(false); 
    } else {
      handleSkipCrop();
    }
  }, [completedCrop, imageSrc]);

  const handlePublish = () => {
    if (!name || !title || !croppedImageBase64) {
      setErrorMsg("Name, Image, and Title are required!");
      return;
    }
    
    setErrorMsg(null);
    setIsPublishing(true);
    
    // Naya data object banaya
    const postObj = {
      ...(editData ? editData : {}), // Purana data retain karo
      name: name,
      title: title,
      about: about,
      image: croppedImageBase64,
      createdAt: editData ? editData.createdAt : new Date().toISOString(), 
    };
    
    setNewPostData(postObj);
    
    // Simulate UI processing
    setTimeout(() => {
      setIsPublishing(false);
      setPostSuccess(true); 
      
      // Success modal ke 3 seconds baad band kardo aur data pass kardo
      setTimeout(() => {
        setPostSuccess(false);
        onClose();
        onSuccess(postObj, !!editData); // Batao ki ye Naya post tha ya Edit hua hai
      }, 3000);

    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202124]/60 backdrop-blur-sm p-4 transition-opacity duration-300">
        
        {/* Transparent Modal */}
        <div className="bg-white/95 backdrop-blur-xl w-full max-w-xl border border-white/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col max-h-[90vh] overflow-hidden relative">
          
          <div className="flex justify-between items-center border-b border-[#dadce0]/50 px-6 py-4 bg-white/50">
            <h2 className="text-xl font-bold text-[#202124]">{editData ? "Edit Your Swag" : "Post Your Swag"}</h2>
            <button onClick={onClose} disabled={isPublishing} className="text-[#5f6368] hover:text-[#202124] transition-colors p-1 disabled:opacity-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-5 p-3 bg-[#fce8e6]/90 border border-[#fbd2ce] text-[#d93025] text-sm font-bold rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {errorMsg}
            </div>
          )}

          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar relative">
            
            {imageRemovedPop && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#202124]/90 text-white font-bold text-xs px-4 py-2 rounded-full shadow-sm flex items-center gap-2 z-30 transition-all duration-300">
                 <svg className="w-4 h-4 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 Image removed!
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Your Full Name</label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setErrorMsg(null); }} placeholder="e.g., Manish Kumar" className="w-full px-4 py-2.5 border border-[#dadce0] rounded-lg text-[#202124] font-medium focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all bg-white/60 focus:bg-white outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Swag Image</label>
              <div className={`relative border ${croppedImageBase64 ? 'border-[#dadce0]' : 'border-dashed border-[#bdc1c6] hover:bg-white/80'} bg-white/60 rounded-lg transition-colors ${croppedImageBase64 ? 'h-72' : 'h-64'} flex flex-col items-center justify-center overflow-hidden`}>
                {!croppedImageBase64 ? (
                  <>
                    <input type="file" accept="image/*" onChange={onSelectFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="text-center flex flex-col items-center">
                      <svg className="w-8 h-8 text-[#1a73e8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-sm font-semibold text-[#202124]">Click or drag to upload image</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full relative group p-2 bg-transparent">
                    <img src={croppedImageBase64} alt="Preview" className="w-full h-full object-contain rounded-md" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={removeImage} className="bg-[#ea4335]/90 hover:bg-[#d93025] text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors flex items-center gap-1.5 text-xs font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Swag Title</label>
              <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setErrorMsg(null); }} placeholder="e.g., Google Cloud Backpack" className="w-full px-4 py-2.5 border border-[#dadce0] rounded-lg text-[#202124] font-medium focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white/60 focus:bg-white outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">About / My Journey</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Describe how you earned this..." className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] font-medium focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] h-24 resize-none bg-white/60 focus:bg-white outline-none"></textarea>
            </div>
          </div>

          <div className="border-t border-[#dadce0]/50 px-6 py-4 bg-white/50 flex justify-end gap-3">
            <button onClick={onClose} disabled={isPublishing} className="px-5 py-2.5 text-[#5f6368] font-bold border border-[#dadce0] bg-white/80 rounded-lg hover:bg-white disabled:opacity-50 transition-colors">Cancel</button>
            <button onClick={handlePublish} disabled={isPublishing} className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-70">
              {isPublishing ? <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : (editData ? "Update Post" : "Publish Post")}
            </button>
          </div>
        </div>

        {isCropping && imageSrc && (
          <div className="fixed inset-0 z-[60] bg-[#202124]/90 backdrop-blur-sm flex flex-col items-center p-6 space-y-4">
             <div className="w-full max-w-4xl flex justify-between items-center text-white pb-3 border-b border-white/20">
                <button onClick={() => { setImageSrc(null); setIsCropping(false); }} className="px-5 py-2.5 text-white font-bold border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-sm">Cancel</button>
                <div className="flex gap-2">
                  <button onClick={handleSkipCrop} className="px-5 py-2.5 text-white font-bold border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-sm">Skip Crop</button>
                  <button onClick={handleConfirmCrop} className="px-6 py-2.5 bg-white text-[#202124] font-bold rounded-lg shadow-md hover:bg-[#f1f3f4] transition-colors text-sm">Confirm</button>
                </div>
             </div>
             <div className="flex-grow flex items-center justify-center p-4 bg-[#202124]/40 rounded-lg border border-white/10 shadow-inner w-full max-w-4xl overflow-hidden relative">
                <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={1 / 1} className="max-w-full max-h-[70vh]">
                    <img ref={imgRef} src={imageSrc} alt="Raw" className="max-w-full max-h-[70vh] rounded-md object-contain" />
                </ReactCrop>
             </div>
          </div>
        )}

        {postSuccess && (
          <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 transition-opacity duration-300">
            <Confetti width={windowDimensions.width} height={windowDimensions.height} numberOfPieces={250} gravity={0.15} opacity={0.9} />
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm border border-white/50 animate-fade-in-up">
              <div className="w-20 h-20 bg-[#e8f0fe] rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-10 h-10 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-[#202124] mb-2">{editData ? "Updated!" : "Posted!"}</h2>
              <p className="text-sm font-medium text-[#5f6368]">Your swag is live on the feed.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}