import React, { useEffect, useState } from 'react';
import styles from '../StorySection/CreateStoryForm.module.css'
import close from '../../assets/Home/close.png'
import { CreateStory, UpdateStory } from '../../APIs/story';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function CreateStoryForm({ closeStoryForm, initialValues, isEditing }) {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [slides, setSlides] = useState([
        { heading: '', description: '', imageUrl: '', category: selectedCategory },
        { heading: '', description: '', imageUrl: '', category: selectedCategory },
        { heading: '', description: '', imageUrl: '', category: selectedCategory }
    ]);

    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (isEditing && initialValues) {
            setSelectedCategory(initialValues.slides[0].category);
            setSlides(initialValues.slides);
        }
    }, [isEditing, initialValues]);


    const addSlide = () => {
        if (slides.length < 6) {
            setSlides([...slides, { heading: '', description: '', imageUrl: '', category: selectedCategory }]);
        }
    };

    const removeSlide = (index) => {
        if (slides.length > 3) {
            const updatedSlides = slides.filter((_, i) => i !== index);
            setSlides(updatedSlides);
        }
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setSelectedCategory(value);
        const updatedSlides = slides.map(slide => ({ ...slide, category: value }));
        setSlides(updatedSlides);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSlides = [...slides];
        updatedSlides[index][name] = value;
        setSlides(updatedSlides);
    };

    const handleNextSlide = () => {
        if (activeSlide < slides.length - 1) {
            setActiveSlide(activeSlide + 1);
        }
    };

    const handlePreviousSlide = () => {
        if (activeSlide > 0) {
            setActiveSlide(activeSlide - 1);
        }
    };

    const handleSlideClick = (index) => {
        setActiveSlide(index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('owner');
            if (isEditing) {
                const response = await UpdateStory(initialValues._id, { userId, slides });
                if (response) {
                    navigate('/');
                    closeStoryForm();
                    toast.success("Story updated successfully!!");
                }
            } else {
                const response = await CreateStory({ userId, slides });
                if (response) {
                    closeStoryForm();
                    toast.success("Story created successfully!!")
                    setTimeout(() => {
                        window.location.reload();
                    }, [3000])
                }
            }
        } catch (error) {
            toast.error("Error submitting story");
            console.error('Error submitting story:', error);
        }
    };

    return (
        <>
            <div className={styles.modal}>
                <div className={styles.overlay}></div>
                <div className={styles.modal_content}>
                    <img src={close} alt="" onClick={closeStoryForm} id={styles.close_btn} />
                    <p id={styles.guide_text}>Add upto 6 slides </p>
                    <h3 id={styles.mob_add_heading}>Add story to feed</h3>
                    <div className={styles.mob_container}>
                        <div className={styles.slideContainer}>
                            {slides.map((slide, index) => (
                                <div className={styles.slides}>
                                    <div
                                        key={index}
                                        onClick={() => handleSlideClick(index)}
                                        className={`${styles.slide_rectangle} ${index === activeSlide ? styles.activeSlide : ''}`}
                                    >
                                        Slide {index + 1}
                                    </div>
                                    {(index >= 3 && slides.length > 3) && (
                                        <img src={close} alt='close' onClick={() => removeSlide(index)} id={styles.remove_slide}></img>
                                    )}
                                </div>
                            ))}
                            {slides.length < 6 && (
                                <button type="button" onClick={addSlide} id={styles.add_btn} className={styles.slide_rectangle}>Add+</button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit}>
                            {slides.map((slide, index) => (
                                <div key={index} className={index === activeSlide ? styles.activeForm : styles.inactiveForm}>
                                    <div className={styles.form_field}>
                                        <label className={styles.label}>Heading :</label>
                                        <input
                                            type="text"
                                            name="heading"
                                            value={slide.heading}
                                            onChange={(e) => handleChange(index, e)}
                                            className={styles.input}
                                            placeholder='Your heading'
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_field}>
                                        <label className={styles.label}>Description :</label>
                                        <textarea
                                            type="text"
                                            name="description"
                                            value={slide.description}
                                            onChange={(e) => handleChange(index, e)}
                                            className={styles.input}
                                            placeholder='Story Description'
                                            id={styles.description}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_field}>
                                        <label className={styles.label}>Image :</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={slide.imageUrl}
                                            onChange={(e) => handleChange(index, e)}
                                            className={styles.input}
                                            placeholder='Add Image url'
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_field}>
                                        <label className={styles.label}>Category :</label>
                                        <select
                                            name="category"
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            className={styles.input}
                                            id={styles.option}
                                            required
                                        >
                                            <option value="" disabled >Select a category</option>
                                            <option value="food">Food</option>
                                            <option value="health and fitness">Health & Fitness</option>
                                            <option value="travel">Travel</option>
                                            <option value="movie">Movie</option>
                                            <option value="education">Education</option>
                                        </select>
                                    </div>

                                </div>
                            ))}
                            <button type="submit" id={styles.post_btn_mob} className={styles.btns} onClick={(e) => handleSubmit(e)}>Post</button>

                        </form>
                    </div>
                    <div className={styles.bottom_btns}>
                        <div className={styles.left_btns}>
                            <button disabled={activeSlide === 0} onClick={handlePreviousSlide} id={styles.previous_btn} className={styles.btns}>Previous</button>
                            <button disabled={activeSlide === slides.length - 1} onClick={handleNextSlide} id={styles.next_btn} className={styles.btns}>Next</button>
                        </div>
                        <button type="submit" id={styles.post_btn} className={styles.btns} onClick={(e) => handleSubmit(e)}>Post</button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default CreateStoryForm;
