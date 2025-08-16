import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { slug } = useParams();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Blog Post: {slug}</h1>
      <p>This page will display a single blog post with beautiful typography and a reading progress indicator.</p>
    </div>
  );
};

export default BlogDetails;