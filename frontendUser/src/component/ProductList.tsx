'use client'
import { useState, useEffect, useRef } from "react";
import CourseCard from "./CourseCard";
import { Course } from "@/types";
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';


export default function CourseList({ courses }: { courses: Course[] }) {
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<any>(null);
    const itemsPerView = 5;
    const maxIndex = Math.max(0, courses.length - itemsPerView);
    const scrollToIndex = (index: number) => {
        if (carouselRef.current) {
            const itemWidth = carouselRef.current.children[0]?.offsetWidth || 0;
            const gap = 16; // gap-4 = 16px
            carouselRef.current.scrollTo({
                left: index * (itemWidth + gap),
                behavior: 'smooth'
            });
        }
    };

    const handlePrevious = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            scrollToIndex(newIndex);
        } else {
            // Khi ở cuối, chuyển sang trang chi tiết (có thể customize)
            handleViewAllProducts();
        }
    };
    const handleViewAllProducts = () => {
        alert('Chuyển sang trang chi tiết sản phẩm');
    };

    const handleProductClick = (product: any) => {
        alert(`Xem chi tiết sản phẩm: ${product.name}`);
        // Trong thực tế: router.push(`/product/${product.id}`)
    };
    type BadgeType = 'Hot' | 'New' | 'Sale' | 'Popular' | 'Best Seller' | 'Premium';
    const getBadgeColor = (badge: BadgeType) => {
        const colors: Record<BadgeType, string> = {
            'Hot': 'bg-red-500',
            'New': 'bg-green-500',
            'Sale': 'bg-orange-500',
            'Popular': 'bg-blue-500',
            'Best Seller': 'bg-purple-500',
            'Premium': 'bg-yellow-500'
        };
        return colors[badge] || 'bg-gray-500';
    };
    console.log('Courses', courses);
    return (

        <div className="flex flex-col min-h-screen justify-start items-center md:justify-start md:items-start mx-auto mb-10 2xl:mt-10">

            <div className="flex justify-center items-center mx-auto grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-1 md:gap-y-7 lg:grid-cols-3 xl:grid-cols-5 2xl:gap-x-0 ">

                {courses.map((course: Course) => (
                    <div key={course.id} className="">

                        <CourseCard product={course} />
                    </div>
                ))}
            </div>
            {/* <Page type={tab.tab}/> */}

        </div>
     
    );
}

