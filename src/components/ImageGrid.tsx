import VideoPlayer from "@/components/VideoPlayer.tsx";
import { EmbedFiles } from "@/types/embed.ts";
import cn from "@/utils/cn.ts";
import { UnLazyImage } from "@unlazy/react";

interface MediaGridProps {
  files: EmbedFiles[];
  onPress?: (file: EmbedFiles) => void;
}

const MediaGrid = ({ files, onPress }: MediaGridProps) => {
  const fileCount = files.length;

  if (fileCount === 0) return null;

  return (
    <div className="grid gap-1 max-w-[400px]">
      {fileCount === 1 && (
        <SingleMedia file={files[0]} onPress={onPress} />
      )}
      {fileCount === 2 && (
        <div className="grid grid-cols-2 gap-1">
          {files.map((file, index) => (
            <SingleMedia key={index} file={file} onPress={onPress} maxWidth={198} maxHeight={224} />
          ))}
        </div>
      )}
      {fileCount === 3 && (
        <div className="grid grid-cols-2 gap-1">
          <div className="grid gap-1">
            {files.slice(0, 2).map((file, index) => (
              <SingleMedia key={index} file={file} onPress={onPress} maxWidth={198} maxHeight={111} />
            ))}
          </div>
          <SingleMedia file={files[2]} onPress={onPress} maxWidth={198} maxHeight={224} />
        </div>
      )}
      {fileCount >= 4 && (
        <div className="grid grid-cols-2 gap-1">
          {files.slice(0, 4).map((file, index) => (
            <SingleMedia key={index} file={file} onPress={onPress} maxWidth={198} maxHeight={111} />
          ))}
        </div>
      )}
    </div>
  );
};

interface SingleMediaProps {
  file: EmbedFiles;
  onPress?: (file: EmbedFiles) => void;
  maxWidth?: number;
  maxHeight?: number;
}

const SingleMedia = ({ file, onPress, maxWidth = 400, maxHeight = 224 }: SingleMediaProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        onPress && "cursor-pointer"
      )}
      style={{
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
      }}
      onClick={() => onPress && onPress(file)}
    >
      {file.type === "Image" ? (
        <UnLazyImage
          src={file.url}
          alt={file.name || "Image"}
          thumbhash={file.thumbHash ?? undefined}
          className="w-full h-full object-cover"
          style={{
            aspectRatio: file.width && file.height ? `${file.width} / ${file.height}` : undefined,
          }}
        />
      ) : (
        <VideoPlayer
          src={file.url}
          poster={"https://placeholder.co/480x480"} // todo: add new embed file field to add poster
          className="w-full h-full object-cover"
          style={{
            aspectRatio: file.width && file.height ? `${file.width} / ${file.height}` : undefined,
          }}
        />
      )}
    </div>
  );
};

export default MediaGrid;