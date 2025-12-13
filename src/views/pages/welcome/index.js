import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";

export default defineElement({
    template,
    methods: {
        openPage(event, target) {
            bridge("openPage", {
                title: target.getAttribute("title"),
                name: target.getAttribute("name")
            })
        }
    },
    style: {
        content: style
    }
});