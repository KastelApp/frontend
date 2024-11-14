import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Volume1, Maximize, Minimize, RotateCcw, Download } from "lucide-react";
import { Slider } from "@nextui-org/react";
import cn from "@/utils/cn.ts";

interface VideoPlayerProps {
    src: string;
    poster: string;
    className?: string;
    style?: React.CSSProperties;
}

const VideoPlayer = ({
    src,
    poster,
    className,
    style
}: VideoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playedOnce, setPlayedOnce] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showControls = useCallback(() => {
        setControlsVisible(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setControlsVisible(false);
            }
        }, 2000);
    }, [isPlaying]);

    useEffect(() => {
        const video = videoRef.current;
        const player = playerRef.current;

        if (!video || !player) return;

        const updateProgress = () => {
            const progress = (video.currentTime / video.duration) * 100;
            setProgress(progress);
            setCurrentTime(video.currentTime);
            setHasEnded(video.ended);
        };

        const handleMouseMove = () => {
            showControls();
        };


        video.addEventListener("timeupdate", updateProgress);
        player.addEventListener("mousemove", handleMouseMove);

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
            player.removeEventListener("mousemove", handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [showControls]);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (hasEnded) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();

                setIsPlaying(true);
                setHasEnded(false);

                return;
            }

            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }

            if (!playedOnce) {
                setPlayedOnce(true);
            }

            setIsPlaying(!isPlaying);
        }
        showControls();
    }, [hasEnded, isPlaying, playedOnce, showControls]);

    const handleVolumeChange = useCallback((newVolume: number | number[]) => {
        const volumeValue = Array.isArray(newVolume) ? newVolume[0] : newVolume;

        setVolume(volumeValue);
        if (videoRef.current) {
            videoRef.current.volume = volumeValue;
        }
        setIsMuted(volumeValue === 0);
    }, []);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            setVolume(isMuted ? 1 : 0);
        }
    }, [isMuted]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            playerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    const handleProgressChange = useCallback((newProgress: number | number[]) => {
        const progressValue = Array.isArray(newProgress) ? newProgress[0] : newProgress;
        if (videoRef.current) {
            const newTime = (progressValue / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
        }
        setProgress(progressValue);
    }, []);

    const formatTime = useCallback((time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        const formattedTime = [minutes, seconds].map((unit) => unit.toString().padStart(2, "0")).join(":");

        return hours > 0 ? [hours, formattedTime].join(":") : formattedTime;
    }, []);

    return (
        <div
            ref={playerRef}
            style={style}
            className={cn(`relative max-w-full aspect-video bg-black group ${!controlsVisible && isPlaying ? "cursor-none" : ""}`, className)}
            onMouseEnter={showControls}
            onMouseLeave={() => {
                if (isPlaying) {
                    setControlsVisible(false);
                }
            }}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                onClick={togglePlay}
                
            />
            {!playedOnce && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
                >
                    <Play size={64} />
                </button>
            )}
            {playedOnce && controlsVisible && (
                <div className="absolute bottom-0 left-0 right-0 bg-darkAccent/75 p-2 transition-opacity duration-300 ease-in-out">
                    <div className="text-white flex">
                        <div className="flex items-center mr-4">
                            <button onClick={togglePlay} className="mr-2">
                                {hasEnded ? <RotateCcw size={18} /> : isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <span className="text-sm">{formatTime(currentTime)}</span>
                        </div>
                        <div className="flex-grow mr-4">
                            <Slider
                                value={[progress]}
                                onChange={handleProgressChange}
                                maxValue={100}
                                step={0.1}
                                className="w-full cursor-pointer"
                                color="secondary"
                                size="sm"
                                aria-label="Player"
                            />
                        </div>
                        <div className="relative group/volume flex align-middle justify-center items-center">
                            <button onClick={toggleMute} className="mr-4">
                                {isMuted ? <VolumeX size={18} /> : volume > 0.5 ? <Volume2 size={18} /> : <Volume1 size={18} />}
                            </button>
                            <div className="absolute bottom-full -left-0.5 hidden group-hover/volume:block">
                                <Slider
                                    value={[volume]}
                                    onChange={handleVolumeChange}
                                    maxValue={1}
                                    step={0.01}
                                    orientation="vertical"
                                    className="h-24 group-hover:block"
                                    color="secondary"
                                    size="md"
                                    aria-label="Volume"
                                />
                            </div>
                        </div>
                        <button onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>
                </div>
            )}
            {controlsVisible && (
                <button className="absolute top-1 right-1 bg-darkAccent p-2 text-white rounded-md transition-opacity duration-300 ease-in-out">
                    <Download size={18} onClick={async () => {
                        const a = document.createElement("a");
                        a.href = src;
                        a.download = "video.mp4";
                        a.click();
                        a.remove();
                    }} />
                </button>
            )}
        </div>
    );
};

export default VideoPlayer;
