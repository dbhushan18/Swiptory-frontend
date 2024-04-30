import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import styles from '../StorySection/StorySection.module.css'
import { GetStory} from '../../APIs/story';
import StoryViewer from '../StoryViewer/StoryViewer';
import edit from '../../assets/Story/edit.png'
import CreateStoryForm from './CreateStoryForm';
import Auth from '../Auth/Auth';

const StorySection = ({ category, showUserStoriesSection, userStories, fetchUserStories }) => {
    const [stories, setStories] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isViewStory, setIsViewStory] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [storyDataForEdit, setStoryDataForEdit] = useState(null);
    const [storiesVisibleCount, setStoriesVisibleCount] = useState(4);
    const [userStoriesVisibleCount, setUserStoriesVisibleCount] = useState(4);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        fetchStories();
        if (localStorage.getItem("owner"))
            fetchUserStories();
    }, [category,selectedStory]);

    const fetchStories = async () => {
        try{
            const response = await GetStory({ category });
            setStories(response);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        setIsViewStory(!isViewStory);
    };

    const closeStory = () => {
        setIsViewStory(!isViewStory);
    }

    const handleEditStory = (story) => {
        setStoryDataForEdit(story);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const toggleShowMoreStories = () => {
        setStoriesVisibleCount(stories.length);
    };

    const toggleShowAllUserStories = () => {
        setUserStoriesVisibleCount(userStories.length);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    }
    const openLoginModal = () => {
        setShowLoginModal(true);
    }

    const handleLikeUpdate = (updatedSlides) => {
        setSelectedStory(prevSelectedStory => ({
          ...prevSelectedStory,
          slides: updatedSlides
        }));
      };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {(localStorage.getItem("owner") && showUserStoriesSection) && (
                        <div className={styles.user_stories}>
                            <h2 className={styles.category_heading}>Your stories</h2>
                            {Object.values(userStories)?.length === 0 ? (
                                <p className={styles.no_story_text}>No stories Available</p>
                            ) : (
                                <div className={styles.story_container}>
                                    {Object.values(userStories).slice(0, userStoriesVisibleCount).map((story) => (
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

                            {userStoriesVisibleCount < userStories.length && (
                                <button onClick={toggleShowAllUserStories} className={styles.more_btn}>See More</button>
                            )}
                        </div>
                    )}

                    <div>
                        <h2 className={styles.category_heading}>Top Stories About {category}</h2>
                        {Object.values(stories).length === 0 ? (
                            <p className={styles.no_story_text}>No stories Available</p>
                        ) : (
                            <div className={styles.story_container}>
                                {Object.values(stories).slice(0, storiesVisibleCount).map((story) => (
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
                                        {localStorage.getItem("owner") === story.userId && (
                                            <button onClick={() => handleEditStory(story)} className={styles.edit_btn}>
                                                <img src={edit} alt="Edit Icon" />
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                ))}

                            </div>
                        )
                        }
                        {storiesVisibleCount < stories.length && (
                            <button onClick={toggleShowMoreStories} className={styles.more_btn}>See More</button>
                        )}
                    </div>

                    {isViewStory && selectedStory && (
                        <StoryViewer
                            closeModal={closeStory}
                            slides={selectedStory.slides}
                            openModal={openLoginModal}
                            onLikeUpdate={handleLikeUpdate}
                        />
                    )}
                    {isEditModalOpen && (
                        <CreateStoryForm
                            closeStoryForm={handleCloseEditModal}
                            initialValues={storyDataForEdit}
                            isEditing={true}
                        />
                    )}
                </div>
            )}
            {showLoginModal && <Auth isOpen={true} onClose={closeLoginModal} modalVal="Login" />}
        </div>
    );
};

export default StorySection;
