import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Action() {
  const [actionMovies, setActionMovies] = useState([]);
  const [fetchedVideoID, setFetchedVideoID] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const sliderRef = useRef(null);

  // Fetch Action Movies with infinite pagination
  useEffect(() => {
    Axios.get(
      `https://api.themoviedb.org/3/discover/movie?with_genres=28&api_key=32f9e877489c276a3376f21bd753a432&page=${page}`
    )
      .then((output) => {
        if (output.data.results.length > 0) {
          setActionMovies((prev) => [...prev, ...output.data.results]); // Append movies
        }
      })
      .catch((error) => console.log(error));
  }, [page]);

  // Play Trailer
  function collectTheMovieName(movie) {
    movieTrailer(movie?.title || movie?.name)
      .then((output) => {
        const videoID = new URLSearchParams(new URL(output).search).get("v");
        setFetchedVideoID(videoID);
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
        ACTION MOVIES
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

      {/* Movie Scroll Section */}
      <div
        ref={sliderRef}
        className="noScroll"
        style={{ display: "flex", overflowX: "scroll" }}
      >
        {actionMovies.map((i) => (
          <img
            key={i.id}
            className="poster"
            style={{ margin: "6px", cursor: "pointer", height: "250px", width: "250px" }}
            onClick={() => collectTheMovieName(i)}
            src={"https://image.tmdb.org/t/p/original" + i.poster_path}
            alt={i.title}
          />
        ))}
      </div>

      {/* Right Arrow - loads more pages */}
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

        {fetchedVideoID && (
          <YouTube videoId={fetchedVideoID} opts={ytOptions} />
        )}
      </Modal>
    </div>
  );
}

export default Action;
