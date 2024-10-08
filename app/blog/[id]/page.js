import { getAllPosts, getPostById } from "@/helpers/parseBlog";
import Link from "next/link";

export default async function Post({ params: { id } }) {
  const { html, title, date } = await getPostById(id);
  const posts = await getAllPosts();

  const shuffled = posts.sort(() => 0.5 - Math.random());
  const shuffledUnique = shuffled.filter((item) => item.id !== id);
  let selected = shuffledUnique.slice(0, 3);

  const DisplayPosts = () => {
    return selected.map((item, i) => {
      return (
        <Link href={`/blog/${item.id}`} key={i}>
          <h2 className="text-md font-bold">
            {item.title} - Published on {item.date}
          </h2>
        </Link>
      );
    });
    6;
  };

  return (
    <main className="flex-grow flex flex-col items-left p-3 text-neutral w-1/2 bg-[white] rounded-md mt-2 drop-shadow-xl border gap-3 max-[999px]:w-4/5">
      <article className="p-4">
        <h1 className="font-bold text-xl  self-center ">{title}</h1>
        <h4>{date}</h4>
        <div className="mt-4  " dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <hr />
      <h2 className="  text-xl  ">Wait, check out these posts too!</h2>
      <DisplayPosts />
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.id;

  const post = await getPostById(id);

  return {
    title: `${post.title} | Arabic Road`,
    openGraph: {
      title: `${post.title} | Arabic Road`,
      type: "article",
      url: `https://arabicroad.com/blog/${id}/`,
    },
    alternates: {
      canonical: `https://arabicroad.com/blog/${id}/`,
    },
  };
}
