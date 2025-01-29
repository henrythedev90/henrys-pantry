import React, { useEffect, useRef } from "react";
import Container from "../Container";
import classes from "./Header.module.css";
import Link from "next/link";
import { NAV_LINK } from "../data/navLinks";
import { useAuth } from "../common/AuthContext";
import jwt from "jsonwebtoken";

const Header = () => {
  {
    /**useRef is null at start, you need to check node's existence before using it.*/
  }
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { token, logout } = useAuth();
  useEffect(() => {
    const headerFunc = () => {
      if (headerRef.current) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        headerRef.current.classList.toggle(
          classes.header_shrink,
          scrollTop > 5
        );
      }
    };
    window.addEventListener("scroll", headerFunc);
    return () => window.removeEventListener("scroll", headerFunc);
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle(`${classes.menu_active}`);
    }
  };

  const decode = token ? jwt.decode(token) : null;

  return token ? (
    <header className={classes.header} ref={headerRef}>
      <Container>
        <div className={classes.nav_wrapper}>
          {/** potential logo will go here */}
          <div className={classes.logo}>
            <Link
              href={`/users/${
                (decode && typeof decode !== "string" && decode.id) || ""
              }`}
            >
              <h1>
                <span>H</span>enry's Pantry
                <span>logged in</span>
              </h1>
            </Link>
          </div>
          <div
            className={`${classes.navigation}`}
            onClick={toggleMenu}
            ref={menuRef}
          >
            <div className={classes.nav_menu}>
              <>
                {NAV_LINK.map((link) => (
                  <Link key={link.path} href={link.path}>
                    {link.display}
                  </Link>
                ))}
                <button onClick={logout}>Logout</button>
              </>

              <div className={`${classes.mobile_logo}`}>
                <Link href={"/"}>
                  <h1 className={classes.mobile_logo_title}>
                    <span>H</span>enry's Pantry
                  </h1>
                </Link>
              </div>
            </div>
          </div>
          <span className={classes.mobile_menu}>
            <div className={classes.menu_line} onClick={toggleMenu}>
              <div>{/** this is the hamburger in the mobile menu*/}</div>
            </div>
          </span>
        </div>
      </Container>
    </header>
  ) : null;
};

export default Header;
