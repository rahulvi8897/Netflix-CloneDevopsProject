import React, { useState, useEffect } from "react";
import Axios from "axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import Modal from "react-modal";

Modal.setAppElement("#root");

function TrendingMovies() {
  const [myTrendingMovies, setMyTrendingMovies] = useState([]);
  const [videoID, setVideoID] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    Axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?language=en-US&api_key=32f9e877489c276a3376f21bd753a432&page=${page}`
    )
      .then((output) => {
        setMyTrendingMovies(output.data.results);
      })
      .catch((error) => console.log(error));
  }, [page]);

  function playTrailer(movieName) {
    movieTrailer(movieName)
      .then((url) => {
        const id = new URLSearchParams(new URL(url).search).get("v");
        setVideoID(id);
        setModalOpen(true);
      })
      .catch((err) => console.log(err));
  }

  const ytOptions = {
    height: "567px",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  // ⭐ Inline CSS (No external CSS file needed)
  const styles = {
    movieRow: {
      display: "flex",
      overflowX: "scroll",
      scrollBehavior: "smooth",
      scrollbarWidth: "none",
    },
    moviePoster: {
      height: "250px",
      width: "250px",
      margin: "6px",
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    arrowBtn: {
      position: "absolute",
      top: "55%",
      transform: "translateY(-50%)",
      zIndex: 20,
      background: "rgba(0,0,0,0.6)",
      color: "white",
      border: "none",
      padding: "10px 18px",
      fontSize: "28px",
      cursor: "pointer",
      borderRadius: "4px",
    },
  };

  return (
    <div
      style={{
        position: "relative",
        marginBottom: "40px",
      }}
    >
      <style>
        {`
          /* Hide scrollbar (Chrome/Safari) */
          .noScroll::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar (Firefox) */
          .noScroll {
            scrollbar-width: none;
          }
          /* Hover enlarge */
          .poster:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      <h2 style={{ color: "white", fontSize: "20px", fontWeight: "900" }}>
        TRENDING MOVIES
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

        {videoID && <YouTube videoId={videoID} opts={ytOptions} />}
      </Modal>

      {/* LEFT ARROW */}
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        style={{ ...styles.arrowBtn, left: 0 }}
      >
        ❮
      </button>

      {/* MOVIE SLIDER */}
      <div className="noScroll" style={styles.movieRow}>
        {myTrendingMovies.map((movie) => (
          <img
            key={movie.id}
            className="poster"
            style={styles.moviePoster}
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            onClick={() => playTrailer(movie.title)}
          />
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={() => setPage((p) => p + 1)}
        style={{ ...styles.arrowBtn, right: 0 }}
      >
        ❯
      </button>
    </div>
  );
}

export default TrendingMovies;
