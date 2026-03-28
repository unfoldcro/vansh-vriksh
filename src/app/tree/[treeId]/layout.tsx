import type { Metadata } from "next";
import { getTreeMetadata } from "@/lib/db/queries";

interface Props {
  params: { treeId: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tree = await getTreeMetadata(params.treeId);

  if (!tree) {
    return {
      title: "Tree Not Found | Vansh Vriksh",
      description: "This family tree does not exist.",
    };
  }

  const title = `${tree.familySurname} परिवार — वंश वृक्ष | Family Tree`;
  const description = `${tree.gotra || ""} गोत्र | ${tree.village || ""}, ${tree.district || ""} | ${tree.totalMembers || 1} सदस्य, ${tree.generations || 1} पीढ़ी — 100% मुफ्त सेवा`;
  const url = `https://vansh-vriksh.unfoldcro.in/tree/${tree.treeId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Vansh Vriksh | वंश वृक्ष",
      locale: "hi_IN",
      type: "website",
      images: [
        {
          url: `/tree/${tree.treeId}/og`,
          width: 1200,
          height: 630,
          alt: `${tree.familySurname} Family Tree`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/tree/${tree.treeId}/og`],
    },
  };
}

export default function TreeLayout({ children }: Props) {
  return children;
}
