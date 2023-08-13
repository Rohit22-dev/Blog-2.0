import React, { useState } from "react";
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
} from "@nextui-org/react";
import { ChevronDownIcon, IconCaretUpFill, SendIcon } from "./icons";
import { Input } from "@nextui-org/input";

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
};

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  const { title, description, image, userName, comments: blogComment } = data;

  const [expanded, setExpanded] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState(null);
  const [currentComment, setCurrentComment] = useState("");

  const toggleComment = () => {
    setShowComment(!showComment);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="py-2">
      <CardHeader className="overflow-visible py-2">
        <Card isFooterBlurred className="w-full relative">
          <Image isZoomed alt="Card example background" src={image.url} />
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
          className="p-0 text-[12px] cursor-pointer self-end"
        >
          {expanded ? "Collapse" : "Read More"}
        </Chip>
        <ButtonGroup variant="flat" size="sm">
          <Button className="text-small ">Comment</Button>
          <Divider orientation="vertical" />
          <Button isIconOnly onClick={toggleComment}>
            {!showComment ? <ChevronDownIcon /> : <IconCaretUpFill />}
          </Button>
        </ButtonGroup>

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
                >
                  Hello
                </Button>
              }
            />
            <div className="flex flex-col gap-1 bg-foreground-100 mt-4 rounded-lg p-2">
              {blogComment.map((item, index) => (
                <span
                  key={index}
                  className="bg-background/50 rounded-md p-2 flex justify-between"
                >
                  <p className="text-tiny">{item.comment}</p>
                  <p className="text-tiny text-danger-500">@_{item.userName}</p>
                </span>
              ))}
            </div>
          </section>
        )}
      </CardBody>
    </Card>
  );
};

export default BlogCard;
