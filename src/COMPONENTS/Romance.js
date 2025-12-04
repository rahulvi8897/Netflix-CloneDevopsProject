import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Romance() {
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [videoID, setVideoID] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const sliderRef = useRef(null);

  // Fetch romance movies with infinite pagination
  useEffect(() => {
    Axios.get(
      `https://api.themoviedb.org/3/discover/movie?with_genres=10749&api_key=32f9e877489c276a3376f21bd753a432&page=${page}`
    )
      .then((output) => {
        if (output.data.results.length > 0) {
          setRomanceMovies((prev) => [...prev, ...output.data.results]);
        }
      })
      .catch((err) => console.log(err));
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

  const ytOptions = {
    height: "567px",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  const scrollSlider = (direction) => {
    const amount = 450;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ position: "relative", marginBottom: "40px" }}>
      {/* Styles for no-scrollbar & hover zoom */}
      <style>
        {`
          .poster:hover { transform: scale(1.1); }
          .noScroll::-webkit-scrollbar { display: none; }
          .noScroll { scrollbar-width: none; }
        `}
      </style>

      <h2 style={{ color: "white", fontSize: "20px", fontWeight: "900" }}>
        Romance Movies ❤️
      </h2>

      {/* Left Arrow */}
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

      {/* Movie Slider */}
      <div
        ref={sliderRef}
        className="noScroll"
        style={{
          display: "flex",
          overflowX: "scroll",
          scrollBehavior: "smooth",
        }}
      >
        {romanceMovies.map((movie) => (
          <img
            key={movie.id}
            className="poster"
            style={{
              height: "250px",
              width: "250px",
              margin: "6px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            onClick={() => playTrailer(movie)}
          />
        ))}
      </div>

      {/* Right Arrow (Loads more + scrolls) */}
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

        {videoID && <YouTube videoId={videoID} opts={ytOptions} />}
      </Modal>
    </div>
  );
}

export default Romance;
