import Link from "next/link";
import Image from "next/image";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useRouter } from "next/router";
import { getCategories, getMediaURL } from "@/lib/api";
import ProductList from "@/components/Products/ProductList";
import LoadingSpinner from "@/components/LoadingSpinner";
import Meta from "@/components/Meta";
import { localize } from "@/lib/formater";

const CategoryProducts = ({ category }) => {
  const router = useRouter();
  const { locale } = router;
  const slug = router.query.slug;

  const seo = {
    title: `${category.name} | Grandonk Merch`,
    keywords: "merch, clothing, brand, categories",
    shareImage: getMediaURL(category.image.formats.medium),
  };

  if (!category) {
    return (
      <>
        <div className="w-full h-44 bg-secondary flex items-end"></div>
        <span className="block w-full h-8 rounded-b-lg bg-secondary" />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Meta seo={seo} />
      <div className="relative flex items-center justify-center w-full h-[80vh] px-6 bg-top bg-cover">
        <Image
          src={getMediaURL(category.image.formats.large)}
          alt={category.name}
          blurDataURL={getMediaURL(category.image.formats.large)}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          loading="lazy"
        />
        <span className="absolute top-0 left-0  block w-full h-full bg-black/50" />
        <div className="text-white text-center z-10 p-16 w-full md:w-1/2 bg-black/70">
          <h1 className="text-6xl uppercase font-bold">{category.name}</h1>
          <p className="text-3xl text-primary mt-6">
            {localize(locale, "bannerTitle")}
          </p>
        </div>
      </div>
      <div className="container mx-auto pt-8 px-6 lg:px-16">
        <Link href="/products">
          <a className="flex items-center justify-end text-2xl space-x-2 text-primary hover:text-dark">
            <span className="text-lg hover:text-dark">
              {localize(locale, "allProducts")}
            </span>
            <FaAngleDoubleRight />
          </a>
        </Link>
      </div>
      {category.products.length > 0 ? (
        <ProductList products={category.products} />
      ) : (
        <div className="min-h-[60vh] p-12">
          <h3 className="text-4xl text-center font-semibold">
            {localize(locale, "emptyCategory")}
          </h3>
        </div>
      )}
    </>
  );
};

export async function getStaticPaths({ locales }) {
  const categories = await getCategories();

  let paths = [];
  locales.forEach((locale) => {
    paths = [
      ...paths,
      ...categories.map((category) => ({
        params: { slug: category.slug },
        locale,
      })),
    ];
  });

  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const { slug } = ctx.params;

  const category = await getCategories(`/${slug}`);

  return {
    props: {
      category,
    },
    revalidate: 20,
  };
}

export default CategoryProducts;
