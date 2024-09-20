import { getAllPosts, getPostById } from "@/helpers/parseBlog";

export default async function Post({ params: { id } }) {
  const { html, title, date } = await getPostById(id);
  return (
    <main className="flex-grow flex flex-col items-left p-3 text-neutral w-1/2 bg-[white] rounded-md mt-2 drop-shadow-xl border gap-3 max-[999px]:w-4/5">
      <article className="p-4">
        <h1 className="font-bold text-xl  self-center ">{title}</h1>
        <h4>{date}</h4>
        <div className="mt-4  " dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    id: post.id,
  }));
}

// export async function generateMetadata({ params: { id } }) {
//   const { title } = await getPostById(id);
//   return {
//     title,
//   };
// }

export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const id = params.id;
  console.log(id);

  // fetch data
  const post = await getPostById(id);
  console.log(post.title);
  // const product = await fetch(`/blog/${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
  };
}

// export default function Page({ params, searchParams }) {}
