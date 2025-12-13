import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";

export default defineElement({
    template,
    methods: {
        openPage(_, target) {
            bridge("openPage", {
                name: target.getAttribute("tag")
            })
        }
    },
    style: {
        content: style
    }
});