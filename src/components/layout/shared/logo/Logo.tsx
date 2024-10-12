import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "flex",
  marginTop: "15px",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image
        src="/images/logos/logo-siensi.png"
        alt="logo"
        height={70}
        width={180}
        priority
      />
    </LinkStyled>
  );
};

export default Logo;
