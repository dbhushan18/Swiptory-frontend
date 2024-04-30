import React, { useEffect, useState } from 'react'
import { getBookmarks } from '../../APIs/story';
import StoryViewer from '../StoryViewer/StoryViewer';
import styles from '../Bookmarks/Bookmarks.module.css'

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isViewStory, setIsViewStory] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [])

  const fetchBookmarks = async () => {
    try {
      const bookmarkData = await getBookmarks(localStorage.getItem("owner"));
      setBookmarks(bookmarkData);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleBookmarkClick = (story) => {
    setSelectedStory(story);
    setIsViewStory(!isViewStory);
  };

  return (
    <div>
      <h2 className={styles.bookmark_heading}>Your Bookmarks</h2>
      {Object.values(bookmarks).length === 0 ? (
        <p className={styles.no_bookmark_text}>No bookmarks Available</p>
      ) : (
        <div className={styles.story_container}>
          {Object.values(bookmarks).map(story => (
            <div className={styles.slides_container} key={story._id}>
              <div
                style={{
                  backgroundImage: `linear-gradient(0deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 50%), linear-gradient(rgb(0, 0, 0) 1%, rgba(0, 0, 0, 0) 20%), url(${story.slides[0].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={styles.slide}
                onClick={() => handleBookmarkClick(story)}
              >
                <div className={styles.slide_detail}>
                  <h3>{story.slides[0].heading}</h3>
                  <p className={styles.story_description}>{story.slides[0].description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isViewStory && selectedStory && (
        <StoryViewer closeModal={handleBookmarkClick} slides={selectedStory.slides} fetchBookmarks={fetchBookmarks} bookmark = {true}/>
      )}
    </div>
  )
}

export default Bookmarks