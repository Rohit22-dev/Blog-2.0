import { title } from "@/components/primitives";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="inline-block text-center justify-center w-full ">
        <h2 className="text-4xl font-semibold mb-6 bg-gradient-to-r from-rose-500 to-blue-500 bg-clip-text text-transparent pb-2 inline-block uppercase">
          Your Blog
        </h2>
        {children}
      </div>
    </section>
  );
}
