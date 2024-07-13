import { useSection } from "deco/hooks/useSection.ts";

export interface Props {
  /**
   * @format rich-text
   * @description The description of name.
   * @default It Works!
   */
  name?: string;
  count?: number;
}

export default function Section({ name = "It Works!", count = 0 }: Props) {
  return (
    <div
      id="it-works"
      class="container py-10 flex flex-col h-screen w-full items-center justify-center gap-16"
    >
      <div
        class="leading-10 text-6xl"
        dangerouslySetInnerHTML={{
          __html: name,
        }}
      />
    </div>
  );
}
