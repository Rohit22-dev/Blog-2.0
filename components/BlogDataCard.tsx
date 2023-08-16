"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Chip,
  ButtonGroup,
  Button,
  Divider,
  Progress,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  IconCaretUpFill,
  IconEdit,
  IconTrash,
  SendIcon,
} from "./icons";
import { Input } from "@nextui-org/input";
import axios from "axios";
import imagekit from "@/utils/imagekit";
import { toast } from "react-toastify";

type BlogItem = {
  _id: string;
  _v: number;
  userId: string;
  userName: string;
  title: string;
  image: { url: string; fileId: string };
  description: string;
  comments: { userName: string; comment: string }[];
};

type BlogCardProps = {
  data: BlogItem;
  isEditable?: boolean;
  setData?: any;
  onDelete?: any;
  setEditBlogId?: any;
  fetchBlogs?: any;
};

const BlogDataCard: React.FC<BlogCardProps> = ({
  data,
  isEditable = false,
  setData,
  onDelete,
  setEditBlogId,
  fetchBlogs,
}) => {
  const { title, description, image, userName } = data;

  const [expanded, setExpanded] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState<
    { userName: string; comment: string }[]
  >([]);
  const [currentComment, setCurrentComment] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleComment = async () => {
    setLoading(true);

    const body = {
      _id: data._id,
      userName,
      comment: currentComment,
    };
    try {
      await axios.patch(
        `https://blog-zlon.onrender.com/blog/${data.userId}/comment`,
        body
      );
      fetchComments();
      setCurrentComment("");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (showComment) {
      fetchComments();
    }
  }, [showComment]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://blog-zlon.onrender.com/blog/${data._id}/comments`
      );
      setComments(res.data[0].comments);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComment = () => {
    setShowComment(!showComment);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const editBlog = async () => {
    setData({
      title,
      description,
      currentImage: image,
    });
    setEditBlogId(data._id);

    onDelete(data._id);
  };

  const deleteBlog = async () => {
    await axios.delete(
      `https://blog-zlon.onrender.com/blog/${data._id}/delete`
    );
    imagekit.deleteFile(data.image.fileId);
    fetchBlogs();
    toast.success("Deleted successfully");
  };

  return (
    <Card className="py-2 h-fit">
      <CardHeader className="overflow-visible py-2">
        <Card isFooterBlurred className="w-full relative">
          <Image
            isZoomed
            width={700}
            alt="Card example background"
            src={image.url}
          />
          <CardFooter className="absolute bg-white/20 opacity-80 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div className="w-full">
              <p className="text-black text-small font-semibold font-mono text-end">
                by @_{userName}
              </p>
            </div>
          </CardFooter>
        </Card>
      </CardHeader>
      <CardBody className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{title}</h4>
        <p className={`${!expanded && "line-clamp-2"} text-small`}>
          {description}
        </p>

        <Chip
          variant="light"
          onClick={toggleExpand}
          color="primary"
          size="sm"
          className="p-0 text-[12px] cursor-pointer self-end mb-2"
        >
          {expanded ? "Collapse" : "Read More"}
        </Chip>
        <div className="flex justify-between w-full">
          <ButtonGroup variant="flat" size="sm">
            <Button className="text-small ">Comment</Button>
            <Divider orientation="vertical" />
            <Button isIconOnly onClick={toggleComment}>
              {!showComment ? <ChevronDownIcon /> : <IconCaretUpFill />}
            </Button>
          </ButtonGroup>
          {isEditable && (
            <div className="flex gap-4 items-center">
              <Button
                size="sm"
                isIconOnly
                color="warning"
                variant="ghost"
                aria-label="Take a photo"
                onClick={editBlog}
              >
                <IconEdit />
              </Button>
              <Button
                size="sm"
                isIconOnly
                color="danger"
                aria-label="Like"
                onClick={deleteBlog}
              >
                <IconTrash />
              </Button>
            </div>
          )}
        </div>

        {showComment && (
          <section className="w-full mt-4">
            <Input
              variant="faded"
              value={currentComment}
              placeholder="Comment here..."
              onValueChange={(value) => setCurrentComment(value)}
              endContent={
                <Button
                  className="-right-3 text-background"
                  endContent={<SendIcon />}
                  color="primary"
                  onClick={handleComment}
                >
                  Send
                </Button>
              }
            />
            <div className="flex flex-col gap-1 bg-foreground-100 mt-4 rounded-lg p-2">
              {comments.map((item, index) => (
                <span
                  key={index}
                  className="bg-background/50 rounded-md p-2 flex justify-between"
                >
                  <p className="text-tiny">{item.comment}</p>
                  <p className="text-tiny text-danger-500">@_{item.userName}</p>
                </span>
              ))}
              {isLoading && (
                <Progress
                  size="sm"
                  isIndeterminate
                  aria-label="Loading..."
                  className="w-full "
                />
              )}
            </div>
          </section>
        )}
      </CardBody>
    </Card>
  );
};

export default BlogDataCard;
