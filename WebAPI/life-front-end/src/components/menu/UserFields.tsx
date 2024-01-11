import React, {useRef, useState} from "react";
import {useAppSelector} from "../../Hooks/reduxHooks";
import MenuItem from "./MenuItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Log} from "oidc-client-ts";

export const UserFields: React.FC = () =>
{
    const [topField, setTopField] = useState(0);
    const fieldsInfo = useAppSelector(state => state.menu.fields);
    const [slider, setSlider] = useState<Slider|null>(null);    
    

    const sliderSettings = {
        // dots: true,
        // lazyLoad: true,
        // infinite: true,
        speed: 500,
        // slidesToShow: 1,
        // slidesToScroll: 1,
        // initialSlide: 2,
        arrows: false,
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        swipeToSlide: true,
        draggable: true,
        // rows: 1,
        beforeChange: function(currentSlide:any, nextSlide:any) {
            console.log("before change", currentSlide, nextSlide);
        },
        afterChange: function(currentSlide:any) {
            console.log("after change", currentSlide);
        }
    };

    const fields = fieldsInfo.map((mapInfo, ind) =>
    {
        return (
            <MenuItem
                key={"MenuItem"+ind}
                ind = {ind}
            />
        );
    });

    function onWheel(e: React.WheelEvent<HTMLDivElement>) {
        if (!slider)
            return;

        if (e.deltaY > 0)
        {
            slider.slickNext();
        } else
        if (e.deltaY < 0)
        {
            slider.slickPrev();
        }
        e.stopPropagation();
    }
    
    return (
    <div
        className={"menu"}
        onWheel={onWheel}
    >

        {/*<div*/}
        {/*    onClick={() => {setTopField(x => x - 1)}}*/}
        {/*    className={"menu--arrow-up"}*/}
        {/*    style={{visibility: topField ? "visible" : "hidden"}}>*/}
        {/*</div>*/}

        {/*{slider}*/}

        <Slider ref={s => {console.log(s);setSlider(s)}} {...sliderSettings}>
            {fields}
        </Slider>
        
        {/*<div*/}
        {/*    onClick={() => {setTopField(x => x + 1)}}*/}
        {/*    className={"menu--arrow-down"}*/}
        {/*    style={{visibility: (topField + 3 < fieldsInfo.length) ? "visible" : "hidden"}}*/}
        {/*>*/}
        {/*</div>*/}
    </div>);
}