import React from "react";

function TitleWithSummary({ title, summary }) {
  return (
    <div className="py-5">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-dim">{summary}</p>
    </div>
  );
}

export default TitleWithSummary;
