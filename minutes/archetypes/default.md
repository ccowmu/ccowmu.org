---
title: "Meeting Minutes – {{ replace .Name "-" "/" | replaceRE "(\d{4})(\d{2})(\d{2})" "$1/$2/$3" }}"
date: {{ substr .Name 0 4 }}-{{ substr .Name 4 2 }}-{{ substr .Name 6 2 }}
---
