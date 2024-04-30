import React, { useEffect, useState } from 'react'
import { getSharedStory } from '../../APIs/story';
import StoryViewer from './StoryViewer';
import { useParams } from 'react-router-dom';

function ShareStoryView() {
    const { slideId } = useParams();
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        fetchSlideDetails();
    }, []);

    async function fetchSlideDetails() {
        try {
            const details = await getSharedStory(slideId);
            const slidesArray = Object.values(details || {});
            setSlides(slidesArray[0]);
        } catch (error) {
            console.error('Error fetching card details:', error);
        }
    }

    return (
        <>
            {slides?.length > 0 && <StoryViewer slides={slides} />}
        </>
    )
}

export default ShareStoryView