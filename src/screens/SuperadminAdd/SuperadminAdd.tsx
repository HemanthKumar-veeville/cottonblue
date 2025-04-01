import React from "react";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { SuperadminSidebarSection } from "./sections/SuperadminSidebarSection/SuperadminSidebarSection";
import { ProductSidebarSection } from "./sections/ProductSidebarSection/ProductSidebarSection";
export const SuperadminAdd = (): JSX.Element => {
  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={17} minSize={15}>
          <SuperadminSidebarSection />
        </ResizablePanel>
        <ResizablePanel defaultSize={83}>
          <ProductSidebarSection />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};
