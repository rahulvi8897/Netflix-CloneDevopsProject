import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Comedy() {
  const [comedyMovies, setComedyMovies] = useState([]);
  const [videoID, setVideoID] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const sliderRef = useRef(null);

  useEffect(() => {
    Axios.get(
      `https://api.themoviedb.org/3/discover/movie?with_genres=35&api_key=32f9e877489c276a3376f21bd753a432&page=${page}`
    )
      .then((output) => {
        if (output.data.results.length > 0) {
          setComedyMovies((prev) => [...prev, ...output.data.results]); 
        }
      })
      .catch((error) => console.log(error));
  }, [page]);

  function playTrailer(movie) {
    movieTrailer(movie?.title || movie?.name)
      .then((url) => {
        const id = new URLSearchParams(new URL(url).search).get("v");
        setVideoID(id);
        setModalOpen(true);
      })
      .catch(() => alert("Trailer not found 😔"));
  }

  const scrollSlider = (direction) => {
    const scrollAmount = 450;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const ytOptions = {
    height: "567px",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  return (
    <div style={{ position: "relative", marginBottom: "40px" }}>
      <style>
        {`
          .poster:hover { transform: scale(1.1); }
          .noScroll::-webkit-scrollbar { display: none; }
          .noScroll { scrollbar-width: none; }
        `}
      </style>

      <h2 style={{ color: "white", fontSize: "20px", fontWeight: "900" }}>
        COMEDY MOVIES 😂
      </h2>

      {/* Trailer Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            width: "65%",
            height: "600px",
            margin: "auto",
            background: "black",
            borderRadius: "10px",
            padding: "10px",
          },
        }}
      >
        <button
          onClick={() => setModalOpen(false)}
          style={{
            float: "right",
            background: "red",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Close
        </button>

        {videoID && (
          <YouTube videoId={videoID} opts={ytOptions} />
        )}
      </Modal>

      {/* Left Scroll Button */}
      <button
        onClick={() => scrollSlider("left")}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          padding: "10px 18px",
          fontSize: "28px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        ❮
      </button>

      {/* Comedy Movies Slider */}
      <div
        ref={sliderRef}
        className="noScroll"
        style={{ display: "flex", overflowX: "scroll" }}
      >
        {comedyMovies.map((movie) => (
          <img
            key={movie.id}
            className="poster"
            style={{
              height: "250px",
              width: "250px",
              margin: "6px",
              cursor: "pointer",
            }}
            src={"https://image.tmdb.org/t/p/original" + movie.poster_path}
            onClick={() => playTrailer(movie)}
          />
        ))}
      </div>

      {/* Right Scroll Button (Load More + Scroll) */}
      <button
        onClick={() => {
          scrollSlider("right");
          setPage((p) => p + 1);
        }}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          padding: "10px 18px",
          fontSize: "28px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        ❯
      </button>
    </div>
  );
}

export default Comedy;
