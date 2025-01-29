import React, { ReactNode } from "react";
import classes from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
}

const Container = (props: ContainerProps) => {
  return <div className={classes.container}>{props.children}</div>;
};

export default Container;
