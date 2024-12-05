interface ProseProps {
  children: React.ReactNode;
}

export const Prose = ({ children }: ProseProps) => (
  <div
    className="prose prose-zinc	prose-base dark:prose-invert
  prose-h1:font-bold prose-h1:text-xl prose-a:accent first:prose-p:m-0 prose-img:rounded-xl first:prose-headings:mt-0 prose-headings:font-medium prose-hr:hidden prose-ul:space-y-2 p-0 m-0 max-w-none "
  >
    {children}
  </div>
);
