import Image from "next/image";
import Link from "next/link";

function Logo(props: any) {
  const { renderDefault, title } = props;

  return (
    <div className="flex items-center space-x-2">
      <Image
        className="rounded-md object-cover"
        src="/wallpaper.webp"
        width={50}
        height={50}
        alt="Logo"
      />
      <>{renderDefault(props)}</>
    </div>
  );
}

export default Logo;
