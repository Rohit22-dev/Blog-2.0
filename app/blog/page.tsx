"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Input } from "@nextui-org/input";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Progress,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { ImageAdd } from "@/components/icons";
import { useDispatch, useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import { isLoggedIn, setUserBlog } from "@/store/slice";
import { useRouter } from "next/navigation";
import imagekit from "@/utils/imagekit";
import BlogDataCard from "@/components/BlogDataCard";

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

export default function BlogPage() {
  const user = useSelector((state: any) => state.counter.user);
  const userBlog: BlogItem[] = useSelector(
    (state: any) => state.counter.userBlog
  );
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isLogin = useSelector(isLoggedIn);
  const router = useRouter();

  if (!isLogin) {
    router.push("/login");
  }

  const initialData = {
    title: "",
    description: "",
    currentImage: {
      url: "",
      fileId: "",
    },
  };
  const [data, setData] = useState(initialData);
  const [image, setImage] = useState(null);
  const [word, setWord] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  // const [userBlogs, setUserBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);

  const handleImageChange = async (e: any) => {
    if (data.currentImage.fileId !== "") {
      await imagekit.deleteFile(data.currentImage.fileId);
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    setImage(file);
    reader.readAsDataURL(file);
    setData((prevData) => {
      return {
        ...prevData,
        currentImage: {
          url: URL.createObjectURL(file),
          fileId: "",
        },
      };
    });
  };

  const validationState = useMemo(() => {
    const description = data.description;
    const words = description.replace(/\s/g, "");
    setWord(words.length);
    return words.length <= 1000 ? "valid" : "invalid";
  }, [data.description]);

  const handleClick = useCallback(async () => {
    setIsPosting(true);

    try {
      let postdata = {
        userId: user?._id,
        image: data.currentImage,
        title: data.title,
        description: data.description,
      };
      // Check if the image file is selected for upload
      if (image) {
        const res = await imagekit.upload({
          file: image,
          fileName: data.title,
          folder: "Blogs",
        });
        // const encodeUrl = await encodeImageToBlurhash({ imageUrl: res.url });
        // console.log(encodeUrl);
        postdata = {
          ...postdata,
          image: { url: res.url, fileId: res.fileId },
        };
      }

      if (editBlogId) {
        await axios.patch("https://blog-zlon.onrender.com/blog/update", {
          ...postdata,
          _id: editBlogId,
        });
      } else {
        await axios.post("https://blog-zlon.onrender.com/blog", postdata);
      }

      // toast.success(`${editBlogId ? "Updated" : "Posted"} successfully`, {
      //   autoClose: 2000,
      // });
      setIsPosting(false);
      onOpen();
      confetti({
        particleCount: 150,
        spread: 360,
        gravity: 0.8,
        shapes: ["circle", "square"],
      });
      fetchBlogs();
      setData(initialData);
      setEditBlogId(null);
    } catch (error) {
      console.log(error);
      setIsPosting(false);
    }
  }, [
    onOpen,
    data.currentImage,
    data.description,
    data.title,
    editBlogId,
    image,
    user?._id,
  ]);

  function Modaal() {
    return (
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Story Sage
              </ModalHeader>
              <ModalBody>
                Your blog has been {editBlogId ? "Updated" : "Posted"}{" "}
                successfull
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                  onPress={onClose}
                >
                  Okay
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  useEffect(() => {
    if (userBlog.length === 0) {
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://blog-zlon.onrender.com/blog/${user._id}/blogs`
      );
      // setUserBlogs(res.data);
      dispatch(setUserBlog(res.data));
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUserBlog = (blogId: any) => {
    const updatedUserBlogs = userBlog.filter((blog) => blog._id !== blogId);
    // setUserBlogs(updatedUserBlogs);
    dispatch(setUserBlog(updatedUserBlogs));
  };

  return (
    <div className="flex flex-col px-4 md:px-20 w-full lg:flex-row gap-6 relative">
      <Modaal />
      <Card className="w-1/2 h-fit sticky top-44">
        <CardHeader></CardHeader>
        <CardBody className="space-y-3">
          <div className="h-fit w-full">
            {data.currentImage.url === "" ? (
              <label
                htmlFor="fileInput"
                className="h-60 w-full flex flex-col text-secondary-500 justify-center items-center cursor-pointer rounded-lg border border-dashed border-secondary-500"
              >
                <ImageAdd className=" opacity-50" />
                <p className="text-lg font-semibold opacity-70">Add image</p>
              </label>
            ) : (
              <label htmlFor="fileInput" className="cursor-pointer">
                <Image src={data.currentImage.url} alt="" />
              </label>
            )}
          </div>

          <input
            type="file"
            hidden
            onChange={handleImageChange}
            id="fileInput"
          />

          <Input
            isRequired
            value={data.title}
            disabled={isPosting}
            onValueChange={(value) => setData({ ...data, title: value })}
            type="text"
            label="Title"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter Title"
          />
          <Textarea
            isRequired
            value={data.description}
            disabled={isPosting}
            onValueChange={(value) => setData({ ...data, description: value })}
            variant="bordered"
            label="Description"
            labelPlacement="outside"
            placeholder="Enter your description"
            validationState={validationState}
            errorMessage={
              validationState === "invalid" &&
              "Description should be less than 1000 words"
            }
          />
          <p className="text-tiny text-warning-500 text-end">{word}/1000</p>
          <Button
            variant="shadow"
            color="primary"
            onClick={handleClick}
            disabled={isPosting}
          >
            Post
          </Button>
        </CardBody>
        {isPosting && (
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="w-full"
          />
        )}
      </Card>
      <div className="lg:w-1/2 lg:overflow-y-scroll h-[71vh] rounded-lg">
        <div className="w-full flex flex-col gap-10 pr-2 ">
          {isLoading ? (
            <div className="flex justify-center w-full">
              <FadeLoader loading={isLoading} color="#0070f0" />
            </div>
          ) : userBlog.length === 0 ? (
            <p className="text-center mt-14 text-lg text-danger-600 font-mono">
              No posts yet
            </p>
          ) : (
            userBlog
              .slice()
              ?.reverse()
              ?.map((item) => (
                <BlogDataCard
                  key={item._id}
                  data={item}
                  isEditable
                  setData={setData}
                  onDelete={handleDeleteUserBlog}
                  setEditBlogId={setEditBlogId}
                  fetchBlogs={fetchBlogs}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
