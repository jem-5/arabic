import MyButton from "@/components/Button";
import { getAllPosts } from "@/helpers/parseBlog";
import Link from "next/link";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="flex-grow flex flex-col items-center  mt-2 ">
      <div className="card lg:card-side p-2 bg-base-100 shadow-xl ">
        <figure className="flex flex-col h-full justify-center">
          <div className="carousel w-96">
            <div id="item1" className="carousel-item w-full">
              <img src="/featured.jpg" className="w-full rounded" />
            </div>
            <div id="item2" className="carousel-item w-full">
              <img src="/featured2.jpg" className="w-full rounded" />
            </div>
            <div id="item3" className="carousel-item w-full">
              <img src="/featured3.jpg" className="w-full rounded" />
            </div>
            <div id="item4" className="carousel-item w-full">
              <img src="/featured4.jpg" className="w-full rounded" />
            </div>
          </div>
          <div className="flex   justify-center gap-2 py-2">
            <a href="#item1" className="btn btn-xs bg-[white] text-[black]">
              1
            </a>
            <a href="#item2" className="btn btn-xs bg-[white] text-[black]">
              2
            </a>
            <a href="#item3" className="btn btn-xs bg-[white] text-[black]">
              3
            </a>
            <a href="#item4" className="btn btn-xs bg-[white] text-[black]">
              4
            </a>
          </div>
        </figure>
        <div className="card-body">
          <h1 className=" text-3xl text-[rgb(105,184,141)] font-bold ">
            ArabicRoad: Learn Arabic Online Free
          </h1>

          <ul className="rounded   list-outside ">
            <li>
              <span className="text-xl">
                700+ Interactive Vocabulary Lessons
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
              <span className="text-xl">20+ Individual Modules</span>
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
                lessons and review missed words
              </p>
            </li>
          </ul>

          <div className="card-actions justify-end">
            <Link href="/dashboard" className="font-bold">
              <MyButton
                text="Start learning"
                classRest={"bg-secondary text-neutral mb-2"}
              />
            </Link>
          </div>
        </div>
      </div>

      <section className="flex-grow flex flex-col items-left p-3 text-neutral w-full  bg-[#ffffff60] rounded-md mt-2 drop-shadow-xl border gap-3 ">
        <h3 className="font-bold text-xl  self-start text-neutral">
          Latest From the Blog:
        </h3>
        <ul className="menu menu-lg  rounded-box w-full ">
          {posts.map((post) => {
            const { id, date, title } = post;
            return (
              <li key={id} className="mt-2">
                <Link
                  href={`/blog/${id}`}
                  className="flex flex-col items-start bg-base-100 text-[white] hover:bg-primary"
                >
                  <p className="text-xl">{title}</p>

                  <p className="text-sm">Published on {date}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
