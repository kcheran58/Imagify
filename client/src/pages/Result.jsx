import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const generatedImage = await generateImage(input);

      if (generatedImage) {
        setImage(generatedImage);
        setIsImageLoaded(true);
      }
    }

    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      {/* Image Display Section */}
      <div>
        <div className="relative">
          <img
            src={image}
            alt="Generated"
            className="max-w-sm rounded"
            onLoad={() => setLoading(false)}
          />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? 'w-full transition-all duration-[5s]' : 'w-0'
            }`}
          />
        </div>
        <p className={!loading ? 'hidden' : ''}>Loading...</p>
      </div>

      {/* Input and Buttons */}
      {!isImageLoaded ? (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
          >
            Generate
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
            onClick={() => setIsImageLoaded(false)}
          >
            Generate Another
          </p>
          <a
            href={image}
            download="generated_image.jpg"
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
