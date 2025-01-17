import MyButton from "@/components/Button";
import { getAllPosts } from "@/helpers/parseBlog";
import Link from "next/link";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/",
  },
};

export function ArcadeEmbed() {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "calc(50.15625% + 41px)",
        height: 0,
        width: "100%",
      }}
    >
      <iframe
        src="https://demo.arcade.software/c7aRitce8IvyVI01vVfE?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Arabic Road - Learn Arabic Online | Free Arabic Language Learning Platform"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          colorScheme: "light",
        }}
      />
    </div>
  );
}

export default async function Home() {
  const posts = await getAllPosts();

  const featuredPost = posts.slice(0, 1)[0];
  const spotlightPosts = posts.slice(1, 3);
  const remainderPosts = posts.slice(3, 8);

  const getFirstWords = (string) => {
    string.replace(/<[^>]*>/g, "");
    const n = 50;
    const output = string.split(" ").slice(0, n).join(" ");
    return output + "...";
  };

  return (
    <main className="  flex flex-col items-center  mt-2 ">
      <div className="chat chat-start w-5/6 lg:w-2/3 m-1 flex justify-center items-end  ">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="36px"
              viewBox="0 -960 960 960"
              width="36px"
              fill="#FFFFFF"
            >
              <path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z" />
            </svg>
          </div>
        </div>
        <div className="chat-bubble w-full bg-accent flex items-center">
          <Link href="/verbs/" className="">
            <span className="font-bold">NEW FEATURE:</span> Learn how to
            conjugate verbs in Arabic: present, past and future tenses. Check
            out our Verb Conjugator today!
          </Link>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 -960 960 960"
            width="36px"
            fill="#FFFFFF"
          >
            <path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        </div>
      </div>

      <div className="card lg:card-side p-2 bg-base-100 shadow-xl w-5/6 lg:w-2/3 ">
        <figure className="  md:h-fit max-[999px]:max-h-96">
          <img src="/featured.jpg" className=" rounded w-5/6 md:w-full  " />
        </figure>
        <div className="card-body">
          <h1 className=" text-3xl text-[rgb(105,184,141)] font-bold ">
            ArabicRoad: Learn Arabic Online Free
          </h1>

          <ul className="rounded   list-outside ">
            <li>
              <span className="text-xl">
                1000+ Interactive Vocabulary Flashcards
              </span>
              <p>
                + Comprehensive lessons include a relevant photo, Arabic voice
                narration and English transliteration
              </p>
              <p>
                + Enhances your learning experience and improves memory
                retention
              </p>
            </li>
            <li>
              <span className="text-xl">35+ Individual Modules</span>
              <p>
                + Curriculum organized into logical segments based on topic &
                level
              </p>
              <p>
                + Explore the relevant vocabulary for a trip to the coffee shop,
                doctor, hotel, etc.
              </p>
            </li>

            <li>
              <span className="text-xl">Track Your Progress</span>{" "}
              <p>+ Access the full curriculum immediately without an account</p>
              <p>
                + With a free account, you can track your progress through the
                lessons & quizzes and review missed words
              </p>
            </li>
          </ul>

          <div className="card-actions justify-end">
            <Link href="/dashboard/" className="font-bold">
              <MyButton
                text="Start learning"
                classRest={"bg-secondary text-neutral mb-2"}
              />
            </Link>
          </div>
        </div>
      </div>

      <section className=" max-w-full flex flex-col items-left p-3 m-3 text-neutral  bg-[#ffffff60] rounded-md mt-4 drop-shadow-xl border gap-3 w-5/6 lg:w-2/3">
        <h3 className="font-bold text-xl  self-start text-neutral">
          Latest From the Blog
        </h3>
        <ul className="menu menu-lg  rounded-box w-full ">
          <li className="mt-2 ">
            <Link
              href={`/blog/${featuredPost.id}/`}
              className=" bg-base-100 text-[white] hover:bg-primary flex flex-col"
            >
              <p className="text-2xl font-bold self-start">
                {featuredPost.title}
              </p>
              <p
                className="text-md "
                dangerouslySetInnerHTML={{
                  __html: getFirstWords(featuredPost.html),
                }}
              ></p>

              <p className="text-sm  self-start">
                Published on {featuredPost.date}
              </p>
            </Link>
          </li>

          <li className="mt-2 ">
            <Link
              href={`/blog/${spotlightPosts[0].id}/`}
              className=" bg-base-100 text-[white] hover:bg-primary flex flex-col"
            >
              <p className="text-xl  self-start">{spotlightPosts[0].title}</p>
              <p
                className="text-md "
                dangerouslySetInnerHTML={{
                  __html: getFirstWords(spotlightPosts[0].html),
                }}
              ></p>

              <p className="text-sm  self-start">
                Published on {spotlightPosts[0].date}
              </p>
            </Link>
          </li>

          <li className="mt-2 ">
            <Link
              href={`/blog/${spotlightPosts[1].id}/`}
              className=" bg-base-100 text-[white] hover:bg-primary flex flex-col"
            >
              <p className="text-xl   self-start">{spotlightPosts[1].title}</p>
              <p
                className="text-md "
                dangerouslySetInnerHTML={{
                  __html: getFirstWords(spotlightPosts[1].html),
                }}
              ></p>

              <p className="text-sm  self-start">
                Published on {spotlightPosts[1].date}
              </p>
            </Link>
          </li>

          {remainderPosts.map((post) => {
            const { id, date, title } = post;
            return (
              <li key={id} className="mt-2">
                <Link
                  href={`/blog/${id}/`}
                  className="flex flex-col items-start bg-base-100 text-[white] hover:bg-primary"
                >
                  <p className="text-xl">{title}</p>

                  <p className="text-sm">Published on {date}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <h3 className="font-bold text-xl  self-end text-neutral">
          <Link href="/blog/">
            More blog posts
            <kbd className="kbd bg-transparent">▶︎</kbd>
          </Link>
        </h3>
      </section>
      <section className=" max-w-full flex flex-col items-left p-3 m-3 text-neutral  bg-[#ffffff60] rounded-md mt-4 drop-shadow-xl border gap-0 w-5/6 lg:w-2/3 font-bold">
        <h3 className="font-bold text-xl  self-start text-neutral">
          Recent News
        </h3>
        <p>2025-01-17 | Added new feature: Verb Conjugator</p>
        <p>2024-11-27 | Added new modules: Relatives, Endearment & Conflict</p>

        <p>2024-11-20 | Added new module: City</p>

        <p>2024-11-13 | Added new module: Proverbs</p>
        <p>2024-10-30 | Added new modules: Insults & Onomatopoeia</p>
        <p>2024-10-26 | Added new module: Calendar</p>
        <p>2024-10-25 | Added new module: Nature</p>
        <p>2024-10-20 | Added new module: Love</p>
      </section>
    </main>
  );
}
