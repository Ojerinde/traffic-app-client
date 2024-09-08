"use client";

import { useEffect, useState } from "react";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { setSignalState } from "@/store/signals/SignalConfigSlice";
import TabsContainer from "@/components/TabsComponents/TabsContainer";

interface IntersectionConfigurationPageProps {
  params: any;
}

const IntersectionConfigurationPage: React.FC<
  IntersectionConfigurationPageProps
> = ({ params }) => {
  const dispatch = useAppDispatch();
  const { signalString } = useAppSelector((state) => state.signalConfig);

  useEffect(() => {
    dispatch(setSignalState());
  }, [dispatch, signalString]);

  return (
    <section className="intersectionConfigPage">
      <h2 className="intersectionConfigPage__header">Traffic Flow Design</h2>
      <div className="intersectionConfigPage__box">
        <div className="intersectionConfigPage__box--left">
          <FourWayIntersection editable />
        </div>
        <div className="intersectionConfigPage__box--right">
          <TabsContainer />
        </div>
      </div>
    </section>
  );
};

export default IntersectionConfigurationPage;
