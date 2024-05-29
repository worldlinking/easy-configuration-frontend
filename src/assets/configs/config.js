export default {
  ip: "http://127.0.0.1:8000",
  nginxIp: "http://127.0.0.1:8001/img",
  nginxWeightIp: "http://127.0.0.1:8001/weights",
  nginxStandWeightIp: "http://127.0.0.1:8001/standmodelweight",
  nginxDatasetsIp: "http://127.0.0.1:8001/datasets",
  nginxRemoteImageIp:"http://127.0.0.1:8001/remoteImage",
  modelsName: [
    "目标检测",
    "语义分割",
    "实例分割",
    "单标签文本分类",
    "多标签文本分类",
    "情感分析",
      "主题挖掘"
  ],
  onlineAnnNames:['OnlineAnnotationObjectDetection','OnlineDev','OnlineDev','OnlineDev','OnlineDev','OnlineAnnotationSentimentCategory','OnlineAnnotationTopicModel'],//与modelsName一一对应
  IoTs: ["可见光传感器", "红外传感器", "激光雷达传感器", "声光气液传感器"],
  socials: ["社交媒体", "公开网站"],
  iotColors: ["#3CB371", "#4169E1", "#FF4500", "#00BFFF"],
  socialsColors: ["#008B8B", "#AB82FF"],
  IOTModels: [
    [
      {
        backPath: "/images/od.jpg",
        title: "目标检测",
        smallTile: "目标检测的任务是找出图像中感兴趣的目标",
        index: 0,
      },
      {
        backPath: "/images/yf.jpg",
        title: "语义分割",
        smallTile: "将原始数据转换为感兴趣区域的掩模",
        index: 1,
      },
      {
        backPath: "/images/is.png",
        title: "实例分割",
        smallTile: "将原始数据转换为感兴趣区域的掩模",
        index: 2,
      },
    ],
    [
      {
        backPath: "",
        title: "模型1",
        smallTile: "模型1描述",
        index: 3,
      },
      {
        backPath: "",
        title: "模型2",
        smallTile: "模型2描述",
        index: 4,
      },
      {
        backPath: "",
        title: "模型3",
        smallTile: "模型3描述",
        index: 5,
      },
    ],
    [
      {
        backPath: "",
        title: "模型1",
        smallTile: "模型1描述",
        index: 6,
      },
      {
        backPath: "",
        title: "模型2",
        smallTile: "模型2描述",
        index: 7,
      },
      {
        backPath: "",
        title: "模型3",
        smallTile: "模型3描述",
        index: 8,
      },
    ],
    [
      {
        backPath: "",
        title: "模型1",
        smallTile: "模型1描述",
        index: 9,
      },
      {
        backPath: "",
        title: "模型2",
        smallTile: "模型2描述",
        index: 10,
      },
      {
        backPath: "",
        title: "模型3",
        smallTile: "模型3描述",
        index: 11,
      },
    ],
  ],
  socialsModel: [
    [
      {
        backPath: "/images/social1.jpg",
        title: "文本分类-单分类",
        smallTile:
          "定制分类标签实现文本内容的自动分类，每个文本属于一种标签类型",
        index: 0,
      },
      {
        backPath: "/images//social2.jpg",
        title: "文本分类-多分类",
        smallTile:
          "定制分类标签实现文本内容的自动分类，每个文本可以属于多个标签类型",
        index: 1,
      },
      {
        backPath: "/images//social3.jpg",
        title: "情感分析",
        smallTile:
          "又称倾向性分析或观点挖掘，可自动挖掘文本中的立场、观点、看法、情绪和喜恶等。",
        index: 2,
      },
      {
        backPath: "/images//topic.png",
        title: "主题挖掘",
        smallTile:
            "可以用来识别大规模文档集（document collection）或语料库（corpus）中潜藏的主题信息。",
        index: 3,
      }
    ],
    [
      {
        backPath: "/images/social1.jpg",
        title: "文本分类-单分类",
        smallTile:
          "定制分类标签实现文本内容的自动分类，每个文本属于一种标签类型",
        index: 0,
      },
      {
        backPath: "/images//social2.jpg",
        title: "文本分类-多分类",
        smallTile:
          "定制分类标签实现文本内容的自动分类，每个文本可以属于多个标签类型",
        index: 1,
      },
      {
        backPath: "/images//social3.jpg",
        title: "情感分析",
        smallTile:
          "又称倾向性分析或观点挖掘，可自动挖掘文本中的立场、观点、看法、情绪和喜恶等。",
        index: 2,
      },
      {
        backPath: "/images//test.png",
        title: "主题挖掘",
        smallTile:
            "可以用来识别大规模文档集（document collection）或语料库（corpus）中潜藏的主题信息。",
        index: 3,
      }
    ],
  ],
};
