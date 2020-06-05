<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time">{{date}}</span> &nbsp; &nbsp;
      <span class="message-data-name">{{username}}</span>
    </div>
    <div class="message other-message float-right">
      {{message}}
    </div>
  </li>
</template>

<script>
export default {
  name: "message",
  props: {
    date: {},
    username: {},
    message: {}
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
$green: #86bb71;
$blue: #ffffff;
$orange: #e38968;
$gray: #92959e;

li {
  padding-bottom: 20px;
  list-style: none;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.message-data {
  margin-bottom: 15px;
}

.message-data-time {
  color: lighten($gray, 8%);
  padding-left: 6px;
}

.message-data-name {
  color: $blue;
  text-transform: capitalize;
}

.message {
  color: #000000;
  padding: 18px 20px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  margin-bottom: 30px;
  width: 90%;
  position: relative;

  &:after {
    bottom: 100%;
    left: 7%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: $green;
    border-width: 10px;
    margin-left: -10px;
  }
}

.my-message {
  background: $green;
}

.other-message {
  background: $blue;

  &:after {
    border-bottom-color: $blue;
    left: 93%;
  }
}

.me {
  margin-right: 3px;
  font-size: 10px;
  color: $blue;
}

.align-left {
  text-align: left;
}

.align-right {
  text-align: right;
}

.float-right {
  float: right;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
</style>