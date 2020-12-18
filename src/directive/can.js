/* eslint-disable no-unused-vars */
// TODO: 必須用API動態取回權限清單
/*
const permissionsList = [
  {
    LocationNo: "L001",
    LocationName: "Tag清單",
    LocationClass: "TagList"
  },
  {
    LocationNo: "L002",
    LocationName: "收藏功能",
    LocationClass: "Favorite"
  },
  {
    LocationNo: "L003",
    LocationName: "布料細部網格",
    LocationClass: "FabricMesh"
  },
  {
    LocationNo: "L004",
    LocationName: "成本單價",
    LocationClass: "CostPrice"
  },
  {
    LocationNo: "L005",
    LocationName: "物性測試表",
    LocationClass: "PhysicalMechanicalTest"
  },
  {
    LocationNo: "L006",
    LocationName: "檔案下載",
    LocationClass: "ModelFileDownload"
  },
  {
    LocationNo: "L007",
    LocationName: "樣品細節頁面",
    LocationClass: "SampleDetailPage"
  },
  {
    LocationNo: "L008",
    LocationName: "3D模型套色",
    LocationClass: "ModelColorProcess"
  }
];*/

/**
 * 權限需要操作 DOM 才需使用 v-can
 * 其他驗證使用 util/hasAuthenticate 判斷
 */

export default {
  bind: function(el, binding, vnode) {
    // FIXME: 處理 user null
    const storedData = JSON.parse(localStorage.getItem('vuex')) || {};
    // FIXME: 處理 MemberLocations null
    let permissions = [];

    if (storedData.User && storedData.User.user) {
      permissions = storedData.User.user.MemberLocations;
    }

    const target = binding.value;
    // TODO: target 核對 permissions，不符合的隱藏或disable
    const permissionItem = permissions.find(
      p => p.LocationClass.toLowerCase() === target.toLowerCase()
    );
    // undefined 表示沒有權限
    // if (!permissionItem) {
    //   switch (target) {
    //     case "ModelFileDownload":
    //       el.disabled = true;
    //       break;
    //     default:
    //       console.log("沒有定義的權限碼");
    //       el.style.display = "none";
    //   }
    // }
    if (!permissionItem && target === 'ModelFileDownload') {
      el.disabled = true;
      return;
    }
    console.log('沒有定義的權限碼');
    el.style.display = 'none';
  }
};
