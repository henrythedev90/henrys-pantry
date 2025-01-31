import React from "react";
import classes from "./SectionSubtitle.module.css";

type SubtitleProps = {
  subTitle: string;
};
const SectionSubtitle = ({ subTitle }: SubtitleProps) => {
  return (
    <div className={classes.section_subtitle}>
      <h2>{subTitle}</h2>
    </div>
  );
};

export default SectionSubtitle;
