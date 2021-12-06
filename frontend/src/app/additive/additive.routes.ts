import { Ng2StateDeclaration } from "@uirouter/angular";
import { AdditiveComponent } from "./components/additive/additive.component";

export let ADDITIVE_STATES: Ng2StateDeclaration[] = [
  {
    name: "app.additive",
    url: "/additive",
    component: AdditiveComponent,
  },
];
