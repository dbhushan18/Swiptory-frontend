import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./storyViewer.module.css";
import crossIcon from "../../assets/Story/crossIcon.png";
import shareIcon from "../../assets/Story/shareIcon.png";
import bookmarkIcon from "../../assets/Story/bookmarkIcon.png";
import blueBookmarkIcon from "../../assets/Story/blueBookmarkIcon.png";
import likeIcon from "../../assets/Story/likeIcon.png";
import redLikeIcon from "../../assets/Story/redLikeIcon.png";
import leftArrow from "../../assets/Story/leftArrow.png";
import rightArrow from "../../assets/Story/rightArrow.png";
import { fetchBookmarkStatus, getLikeData, updateBookmarkStatus, updateLikeStatus } from "../../APIs/story";
import Auth from "../Auth/Auth";

const StoryViewer = (props) => {
  const navigate = useNavigate();
  const slideDuration = 4000;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = props.slides;

  const [likeCount, setLikeCount] = useState(
    slides.map((slide) => slide.likes.length)
  );
  const [likeStatus, setLikeStatus] = useState(
    slides.map((slide) => slide.likes.includes(localStorage.getItem("owner")))
  );

  const [bookmarkStatus, setBookmarkStatus] = useState(
    slides.map((slide) => slide.bookmarks.includes(localStorage.getItem("owner")))
  );

  const [linkCopiedStatus, setLinkCopiedStatus] = useState(
    slides.map(() => {
      return false;
    })
  );

  useEffect(() => {
    getBookmarkStatus();
  }, [currentSlideIndex, slides]);


  const getBookmarkStatus = async () => {
    try {
      if (localStorage.getItem("owner")) {
        const response = await fetchBookmarkStatus(slides[currentSlideIndex]._id)
        if (response) {
          const newBookmarkStatus = [...bookmarkStatus];
          newBookmarkStatus[currentSlideIndex] = response.isBookmarked;
          setBookmarkStatus(newBookmarkStatus);
        } else {
          console.error("Bookmark status fetch failed");
        }
      }
    } catch (error) {
      console.error("Error while fetching bookmark status:", error);
    }
  };


  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, slideDuration);

    return () => {
      clearInterval(interval);
    };
  }, [currentSlideIndex]);

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };


  const handleBookmark = async (slideIndex) => {
    if (!localStorage.getItem("token")) {
      props.closeModal();
    }
    try {
      const slideId = slides[slideIndex]._id;
      const endpoint = bookmarkStatus[slideIndex] ? "removeBookmark" : "addBookmark";

      const newBookmarkStatus = [...bookmarkStatus];
      newBookmarkStatus[slideIndex] = !bookmarkStatus[slideIndex];
      setBookmarkStatus(newBookmarkStatus);

      const response = await updateBookmarkStatus(endpoint, slideId);
      if (response)
        props.fetchBookmarks();
      else {
        props.openModal();
        console.error("Like action failed");
      }

    } catch (error) {
      console.error("Error while performing bookmark action:", error);
    }
  };

  const handleLike = async (slideIndex) => {
    if (!localStorage.getItem("token")) {
      props.closeModal();
    }
    try {
      const slideId = slides[slideIndex]._id;

      const newLikeStatus = [...likeStatus];
      newLikeStatus[slideIndex] = !likeStatus[slideIndex];
      setLikeStatus(newLikeStatus);

      const response = await updateLikeStatus(slideId);
      console.log(response)
      if (response) {
        const newLikeCount = [...likeCount];
        newLikeCount[slideIndex] = response.totalLikes;
        setLikeCount(newLikeCount);

        props.onLikeUpdate(response.slides);

      } else {
        props.openModal();
        console.error("Like action failed");
      }
    } catch (error) {
      console.error("Error while performing like action:", error);
    }
  };


  const handleShare = (slideIndex) => {
    const currentURL = window.location.href;
    const updatedURL = `${currentURL}viewstory/${slides[slideIndex]._id}`;
    navigator.clipboard.writeText(updatedURL)
      .then(() => {
        console.log("Story URL copied to clipboard:", updatedURL);
      })
      .catch((error) => {
        console.error("Failed to copy story URL to clipboard:", error);
      });

    const newLinkCopiedStatus = [...linkCopiedStatus];
    newLinkCopiedStatus[slideIndex] = true;
    setLinkCopiedStatus(newLinkCopiedStatus);

    setTimeout(() => {
      const newLinkCopiedStatus = [...linkCopiedStatus];
      newLinkCopiedStatus[slideIndex] = false;
      setLinkCopiedStatus(newLinkCopiedStatus);
    }, 1000);
  };



  const handleContainerClick = (event) => {
    const containerWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;
    const clickPercentage = (clickX / containerWidth) * 100;

    if (clickY >= 75 && clickY <= 550) {
      if (clickPercentage <= 50) {
        handlePreviousSlide();
      } else {
        handleNextSlide();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.story_viewer_container}>
        <img
          onClick={handlePreviousSlide}
          src={leftArrow}
          alt="left arrow"
          className={styles.left_arrow}
        />
        <div className={styles.story_viewer}>
          <div className={styles.progress_bar_container}>
            {slides.map((slide, index) => {
              const isActive = index === currentSlideIndex;
              const isCompleted = index < currentSlideIndex;
              return (
                <div
                  key={index}
                  className={`${styles.progress_bar} ${isCompleted ? styles.progress_bar_completed : ""}`}
                >
                  <div
                    className={`${styles.progress_bar_fill} ${isActive ? styles.progress_bar_active : ""}`}
                    style={{ animationDuration: isActive ? `${slideDuration}ms` : '0ms' }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              backgroundImage: `linear-gradient(0deg, rgb(0, 0, 0) 15%, rgba(0, 0, 0, 0) 35%), linear-gradient(rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0) 25%), url(${slides[currentSlideIndex].imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={(event) => handleContainerClick(event)}
            className={styles.category_story}
          >
            {linkCopiedStatus[currentSlideIndex] && (
              <div className={styles.link_copied_msg}>
                Link copied to clipboard
              </div>
            )}

            <div className={styles.story_details}>
              <div className={styles.category_story_header}>
                {slides[currentSlideIndex].heading}
              </div>
              <div className={styles.category_story_description}>
                {slides[currentSlideIndex].description}
              </div>
            </div>
          </div>

          <img
            onClick={props.closeModal}
            src={crossIcon}
            alt="cross icon"
            className={styles.cross_icon}
          />
          <img
            onClick={() => {
              handleShare(currentSlideIndex);
            }}
            src={shareIcon}
            alt="share icon"
            className={styles.share_icon}
          />
          <img
            onClick={() => handleBookmark(currentSlideIndex)}
            src={
              bookmarkStatus[currentSlideIndex]
                ? blueBookmarkIcon
                : bookmarkIcon
            }
            alt="bookmark icon"
            className={styles.bookmark_icon}
          />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
            className={styles.like_icon}
          >
            <img
              onClick={() => {
                handleLike(currentSlideIndex);
              }}
              src={likeStatus[currentSlideIndex] ? redLikeIcon : likeIcon}
              alt="like icon"
            />
            <p
              style={{
                color: "white",
              }}
            >
              {likeCount[currentSlideIndex]}

            </p>
          </div>
        </div>
        <img
          onClick={handleNextSlide}
          src={rightArrow}
          alt="right arrow"
          className={styles.right_arrow}
        />
      </div>
    </div>
  );
};

export default StoryViewer;
