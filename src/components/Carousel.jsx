import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Botão anterior customizado
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 15,
        transform: "translateY(-50%)",
        zIndex: 2,
        bgcolor: "rgba(255,255,255,0.8)",
        "&:hover": { bgcolor: "white" },
      }}
    >
      <ArrowBackIos fontSize="small" />
    </IconButton>
  );
}

// Botão próximo customizado
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 15,
        transform: "translateY(-50%)",
        zIndex: 2,
        bgcolor: "rgba(255,255,255,0.8)",
        "&:hover": { bgcolor: "white" },
      }}
    >
      <ArrowForwardIos fontSize="small" />
    </IconButton>
  );
}

export default function Carousel({ images }) {
  if (!images || images.length === 0) {
    return <p>Nenhuma imagem disponível</p>;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative mb-8 w-full">
      <div className="relative h-96 rounded-xl overflow-hidden">
        <img
          src={images[currentImageIndex].url}
          alt={1}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex space-x-2 mt-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-[#003636]' : 'border-gray-200'
              }`}
          >
            <img src={image.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
