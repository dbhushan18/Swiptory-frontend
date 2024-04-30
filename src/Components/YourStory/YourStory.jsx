import React, { useEffect, useState } from 'react'
import styles from '../YourStory/YourStory.module.css'
import { getUserStories } from '../../APIs/story';
import edit from '../../assets/Story/edit.png'
import StoryViewer from '../StoryViewer/StoryViewer';
import Loader from '../Loader/Loader';

function YourStory() {
  const [userStories, setUserStories] = useState({});
  const [selectedStory, setSelectedStory] = useState(null);
  const [isViewStory, setIsViewStory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStories();
  }, [])

  const fetchUserStories = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await getUserStories(localStorage.getItem("owner"));
        setLoading(false);
        setUserStories(response);
      } catch (error) {
        console.error('Error fetching user stories:', error);
      }
    }
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setIsViewStory(!isViewStory);
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.user_stories}>
          <h2 className={styles.category_heading}>Your stories</h2>
          {Object.values(userStories).length === 0 ? (
            <p className={styles.no_story_text}>No stories Available</p>
          ) : (
            <div className={styles.story_container}>
              {Object.values(userStories).map((story) => (
                <div className={styles.slides_container} key={story._id}>
                  <div
                    style={{
                      backgroundImage: `linear-gradient(0deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 50%), linear-gradient(rgb(0, 0, 0) 1%, rgba(0, 0, 0, 0) 20%), url(${story.slides[0].imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className={styles.slide}
                    onClick={() => handleStoryClick(story)}
                  >
                    <div className={styles.slide_detail}>
                      <h3>{story.slides[0].heading}</h3>
                      <p className={styles.story_description}>{story.slides[0].description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleEditStory(story)} className={styles.edit_btn}>
                    <img src={edit} alt="Edit Icon" />
                    Edit
                  </button>
                </div>
              ))}

            </div>
          )}
        </div>
      )}

      {isViewStory && selectedStory && (
        <StoryViewer closeModal={handleStoryClick} slides={selectedStory.slides} fetchBookmarks={fetchUserStories} bookmark={true} />
      )}
    </div>
  )
}

export default YourStory