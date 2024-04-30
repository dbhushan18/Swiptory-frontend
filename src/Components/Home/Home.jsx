import React, { useEffect, useState } from 'react';
import styles from "../Home/Home.module.css";
import All from '../../assets/Home/all.jpg';
import food from '../../assets/Home/food.jpeg';
import health from '../../assets/Home/health.png';
import travel from '../../assets/Home/travel.jpg';
import movie from '../../assets/Home/movie.jpg';
import education from '../../assets/Home/education.jpg';
import cross from '../../assets/Story/cross.png'
import AuthModal from '../Auth/Auth';
import bookmark from '../../assets/Home/bookmark.png';
import menu from '../../assets/Home/menu.png';
import profile from '../../assets/Home/profile.png';
import { useNavigate } from 'react-router-dom';
import StorySection from '../StorySection/StorySection';
import CreateStoryForm from '../StorySection/CreateStoryForm';
import Bookmarks from '../Bookmarks/Bookmarks';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import YourStory from '../YourStory/YourStory';
import { GetStory, getUserStories } from '../../APIs/story';

function Home() {
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [addStory, setAddStory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [bookmarkOpen, setBookmarkOpen] = useState(false);
    const [mobileProfile, setMobileProfile] = useState(false);
    const [registerLogin, setRegisterLogin] = useState(false);
    const [showYourStories, setShowYourStories] = useState(false); 
    const [userStories, setUserStories] = useState([]);

    const navigate = useNavigate();

    const openRegistrationModal = () => {
        setIsRegistrationModalOpen(true);
    };

    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const showProfileDetails = () => {
        setShowProfile(!showProfile);
    };

    const openStoryForm = () => {
        setAddStory(true);
    };

    const closeStoryForm = () => {
        setAddStory(false);
    };

    const logout = () => {
        localStorage.clear();
        setShowProfile(false);
        setMobileProfile(false);
        toast.success("User Logged out successfully")
        navigate("/");
    };

    const handleMobileProfile = () => {
        if (localStorage.getItem("owner")) {
            setMobileProfile(true);
        }
        else {
            setRegisterLogin(true);
        }
    }

    const handleYourStoryClick = () => {
        setBookmarkOpen(false)
        setMobileProfile(false)
        setShowYourStories(true)
    };

    const handleBookmarkClick = () => {
        setMobileProfile(false)
        setShowYourStories(false)
        setBookmarkOpen(true)
    }

    const handleLoginSuccess = async (userId) => {
        try {
            if (!userId) {
                const response = await getUserStories(localStorage.getItem("owner"));
                setUserStories(response);
            }
            else {
                const response = await getUserStories(userId);
                setUserStories(response);
            }

        } catch (error) {
            console.error('Error fetching user stories:', error);
        }
    };

     const fetchUserStories = async () => {
        try {
            if(localStorage.getItem("owner")){
            const response = await getUserStories(localStorage.getItem("owner"));
            setUserStories(response);
            // setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user stories:', error);
        }
    };


    return (
        <>
            <div className={styles.container}>
                <div className={styles.nav}>
                    <h3 id={styles.app_name} onClick={() => window.location.reload()}>SwipTory</h3>
                    <img src={menu} alt="" id={styles.mobile_menu} onClick={handleMobileProfile} />
                    {localStorage.getItem("token") ? (
                        <>
                            <div className={styles.user_present}>
                                <div className={styles.bookmark_div} onClick={() => setBookmarkOpen(true)}>
                                    <img src={bookmark} alt="" id={styles.bookmark_icon} />
                                    <div id={styles.bookmark_btn}>Bookmarks</div>
                                </div>
                                <button className={styles.btns} id={styles.addstory_btn} onClick={openStoryForm}>Add Story</button>
                                {addStory && <CreateStoryForm closeStoryForm={closeStoryForm} />}
                                <img src={profile} alt="" id={styles.profile_photo} />
                                <img src={menu} alt="" onClick={showProfileDetails} id={styles.menu} />
                                {showProfile && (
                                    <div className={styles.profile_details}>
                                        <h3>{localStorage.getItem("userName")}</h3>
                                        <button className={styles.btns} id={styles.logout_btn} onClick={logout}>Logout</button>
                                    </div>
                                )}
                            </div>
                            {mobileProfile && (
                                <div className={styles.mob_user_present}>
                                    <div className={styles.user_details}>
                                        <img src={profile} alt="" id={styles.profile_photo} />
                                        <h3 id={styles.userName}>{localStorage.getItem("userName")}</h3>
                                        <img src={cross} alt="" id={styles.cross_btn_profile} onClick={() => setMobileProfile(false)} />
                                    </div>
                                    <button className={styles.btns} id={styles.yourstory_btn} onClick={handleYourStoryClick}>Your Story</button>
                                    <button className={styles.btns} id={styles.addstory_btn} onClick={openStoryForm}>Add Story</button>
                                    <div className={styles.bookmark_div} onClick={handleBookmarkClick}>
                                        <img src={bookmark} alt="" id={styles.bookmark_icon} />
                                        <div id={styles.bookmark_btn}>Bookmarks</div>
                                    </div>
                                    <button className={styles.btns} id={styles.logout_btn} onClick={logout}>Logout</button>
                                    {addStory && <CreateStoryForm closeStoryForm={closeStoryForm} />}

                                </div>
                            )}

                        </>
                    ) : (
                        <>
                            <div className={styles.auth_div}>
                                <button className={styles.btns} id={styles.register_btn} onClick={openRegistrationModal} >Register Now</button>
                                <button className={styles.btns} id={styles.login_btn} onClick={openLoginModal}>Sign In</button>
                            </div>
                            <div>
                                {registerLogin && (
                                    <div className={styles.mob_profile_container}>
                                        <img src={cross} alt="" id={styles.cross_btn} onClick={() => setRegisterLogin(false)} />
                                        <button className={styles.mob_btn} id={styles.mob_login_btn} onClick={openLoginModal}>Login</button>
                                        <button className={styles.mob_btn} onClick={openRegistrationModal}>Register</button>
                                    </div>
                                )}
                                {isRegistrationModalOpen && (
                                    <AuthModal isOpen={isRegistrationModalOpen} onClose={closeRegistrationModal} modalVal="Register" onLoginSuccess={handleLoginSuccess}/>
                                )}

                                {isLoginModalOpen && (
                                    <AuthModal isOpen={isLoginModalOpen} onClose={closeLoginModal} modalVal="Login" onLoginSuccess={handleLoginSuccess} />
                                )}
                            </div>
                        </>
                    )}
                </div>

                {bookmarkOpen ? (
                    <Bookmarks />
                ) : (
                    <>
                        {showYourStories ? (
                            <YourStory />
                        ) : (
                            <>
                                <div className={styles.filters}>
                                    <div className={`${styles.filter} ${selectedCategory === 'all' ? styles.selected_filter : ''}`} onClick={() => setSelectedCategory('all')} >
                                        <img src={All} alt="" className={styles.image} />
                                        <h2 className={styles.heading}>All</h2>
                                    </div>
                                    <div className={`${styles.filter} ${selectedCategory === 'food' ? styles.selected_filter : ''}`} onClick={() => setSelectedCategory('food')} >
                                        <img src={food} alt="" className={styles.image} />
                                        <h2 className={styles.heading}>Food</h2>
                                    </div>
                                    <div className={`${styles.filter} ${selectedCategory === 'health and fitness' ? styles.selected_filter : ''}`} onClick={() => setSelectedCategory('health and fitness')} >
                                        <img src={health} alt="" className={styles.image} />
                                        <h2 className={styles.heading}>Health and Fitness</h2>
                                    </div>
                                    <div className={`${styles.filter} ${selectedCategory === 'travel' ? styles.selected_filter : ''}`} onClick={() => setSelectedCategory('travel')} >
                                        <img src={travel} alt="" className={styles.image} />
                                        <h2 className={styles.heading}>Travel</h2>
                                    </div>
                                    <div className={`${styles.filter} ${selectedCategory === 'movie' ? styles.selected_filter : ''}`} onClick={() => setSelectedCategory('movie')} >
                                        <img src={movie} alt="" className={styles.image} />
                                        <h2 className={styles.heading}>Movies</h2>
                                    </div>
                                    <div className={`${styles.filter} ${selectedCategory === 'education' ? styles.selected_filter : ''}`} onClick={() => setSelectedCategory('education')} >
                                        <img src={education} alt="" className={styles.image} />
                                        <h2 className={styles.heading}>Education</h2>
                                    </div>
                                </div>
                                <div>
                                    {(selectedCategory === 'all' || selectedCategory === 'food') && <StorySection category="food" showUserStoriesSection={selectedCategory === 'all'} userStories={userStories} fetchUserStories={fetchUserStories}/>}
                                    {(selectedCategory === 'all' || selectedCategory === 'health and fitness') && <StorySection category="health and fitness" userStories={userStories} fetchUserStories={fetchUserStories} />}
                                    {(selectedCategory === 'all' || selectedCategory === 'travel') && <StorySection category="travel" userStories={userStories} fetchUserStories={fetchUserStories}/>}
                                    {(selectedCategory === 'all' || selectedCategory === 'movie') && <StorySection category="movie" userStories={userStories} fetchUserStories={fetchUserStories}/>}
                                    {(selectedCategory === 'all' || selectedCategory === 'education') && <StorySection category="education" userStories={userStories} fetchUserStories={fetchUserStories}/>}
                                </div>
                            </>
                        )}
                    </>
                )}

            </div>
        </>
    );
}

export default Home;
