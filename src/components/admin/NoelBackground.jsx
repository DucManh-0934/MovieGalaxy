import { useEffect, useState } from "react";
import "./NoelBackground.css";

const NOEL_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/3468/3468377.png",
  "https://cdn-icons-png.flaticon.com/512/3468/3468379.png",
  "https://cdn-icons-png.flaticon.com/512/3468/3468382.png",
  "https://cdn-icons-png.flaticon.com/512/3468/3468386.png",
  "https://cdn-icons-png.flaticon.com/512/3468389.png"
];

export default function NoelBackground() {
  const [items, setItems] = useState([]);
  const [snows, setSnows] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      img: NOEL_IMAGES[Math.floor(Math.random() * NOEL_IMAGES.length)],
      left: Math.random() * 100,
      size: 30 + Math.random() * 40,
      duration: 12 + Math.random() * 10
    }));
    setItems(generated);

    const snowGenerated = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 6,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5
    }));
    setSnows(snowGenerated);
  }, []);

  return (
    <div className="noel-bg">
      {/* Noel icon bay */}
      {items.map(item => (
        <img
          key={item.id}
          src={item.img}
          alt="noel"
          className="noel-item w-10 h-10"
          style={{
            left: `${item.left}%`,
            animationDuration: `${item.duration}s`
          }}
        />
      ))}

      {/* Tuyết rơi */}
      {snows.map(snow => (
        <span
          key={snow.id}
          className="snow"
          style={{
            left: `${snow.left}%`,
            width: snow.size,
            height: snow.size,
            animationDuration: `${snow.duration}s`,
            animationDelay: `${snow.delay}s`
          }}
        />
      ))}
    </div>
  );
}