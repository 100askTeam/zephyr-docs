---
sidebar_position: 8
---
# 网络通信

- 源码获取：[AppBaseCode](https://dl.100ask.net/Hardware/MPU/RK3576-DshanPi-A1/utils/AppBaseCode/)

## 1 网络通信概述

Linux网络通信是基于TCP/IP协议栈 的分层架构实现的分布式进程间交互机制，其核心通过套接字（Socket）接口为应用层提供统一的网络编程入口。该协议栈分为四层：

- 应用层：（如HTTP、FTP）负责具体服务定义；


- 传输层：（TCP/UDP）管理端到端数据传输，其中TCP提供可靠连接，UDP实现无连接通信；


- 网络层：（IP协议）负责逻辑寻址与跨网路由选择，确保数据包跨广域网（WAN）或局域网（LAN）传输；


- 数据链路层：通过MAC地址完成物理介质上的帧传输，并进行错误检测（如CRC校验）。数据发送时，应用层数据逐层封装头部信息（如传输层端口号、网络层IP地址、链路层MAC地址），形成数据包；接收端则逆向解封装以还原原始数据。


简单来说，Linux网络通信就像是计算机之间互相“打电话”或“发消息”的方式！想象一下，当你用手机给朋友发消息时，手机需要通过信号塔、运营商网络等一步步传递信息，最终对方才能收到。Linux网络通信也是这样，它有一套“规则”（叫协议）和“工具”（叫套接字）来让不同电脑像朋友聊天一样交流。

### 1.1 IP和端口

所有的数据传输，都有三个要素 ：源、目的、长度。

怎么表示源或者目的呢？请看图 8.1：



图 8.1 网络源和目的

所以，在网络传输中需要使用“IP和端口”来表示源或目的。

### 1.2 网络传输中的2个对象：server和client

我们经常访问网站，这涉及2个对象：网站服务器，浏览器。网站服务器平时安静地呆着，浏览器主动发起数据请求。网站服务器、浏览器可以抽象成2个软件的概念：server程序、client程序。



图 8.2 网络客户端和服务器

### 1.3 两种传输方式：TCP/UDP

在一般的网络书籍中，网络协议被分为5层，如图 8.3所示：



图 8.3 网络协议层

应用层：它是体系结构中的最高层，直接为用户的应用进程（例如电子邮件、文件传输和终端仿真）提供服务。在因特网中的应用层协议很多，如支持万维网应用的HTTP协议，支持电子邮件的SMTP协议，支持文件传送的FTP协议，DNS，POP3，SNMP，Telnet等等。

运输层：负责向两个主机中进程之间的通信提供服务。

运输层主要使用以下两种协议： 

①  传输控制协议TCP(Transmission Control Protocol)：面向连接的，数据传输的单位是报文段，能够提供可靠的交付。 

②  用户数据包协议UDP(User Datagram Protocol)：无连接的，数据传输的单位是用户数据报，不保证提供可靠的交付，只能提供“尽最大努力交付”。

- 网络层：负责将被称为数据包（datagram）的网络层分组从一台主机移动到另一台主机。


- 链路层：因特网的网络层通过源和目的地之间的一系列路由器路由数据报。


- 物理层：在物理层上所传数据的单位是比特。物理层的任务就是透明地传送比特流。


这些层对于初学者来说很难理解，我们只需要知道：我们需要使用“运输层”编写应用程序，我们的应用程序位于“应用层”。

使用“运输层”时，可以选择TCP协议，也可以选择UDP协议。

1 **TCP和UDP原理上的区别**

​	TCP向它的应用程序提供了面向连接的服务。这种服务有2个特点：可靠传输、流量控制（即发送方/接收方速率匹配）。它包括了应用层报文划分为短报文，并提供拥塞控制机制。

​	UDP协议向它的应用程序提供无连接服务。它没有可靠性，没有流量控制，也没有拥塞控制。

2 **为何存在UDP协议**

​	既然TCP提供了可靠数据传输服务，而UDP不能提供，那么TCP是否总是首选呢？

​	答案是否定的，因为有许多应用更适合用UDP，举个例子：视频通话时，使用UDP，偶尔的丢包、偶尔的花屏时可以忍受的；如果使用TCP，每个数据包都要确保可靠传输，当它出错时就重传，这会导致后续的数据包被阻滞，视频效果反而不好。

使用UDP时，有如下特点：

①  关于何时发送什么数据控制的更为精细

采用UDP时只要应用进程将数据传递给UDP，UDP就会立即将其传递给网络层。而TCP有重传机制，而不管可靠交付需要多长时间。但是实时应用通常不希望过分的延迟报文段的传送，且能容忍一部分数据丢失。

②  无需建立连接，不会引入建立连接时的延迟。

③  无连接状态，能支持更多的活跃客户。

④  分组首部开销较小。

3 **TCP/UDP网络通信大概交互图**

下面我们分别画出运用TCP协议和运用UDP协议的客户端和服务器大概交互图。



图 8.4面向连接的TCP流模式



图 8.5UDP用户数据包模式

## 2 网络编程主要函数介绍

### 2.1 socket函数

```
int socket(int domain, int type,int protocol);
```

此函数用于创建一个套接字。

- **domain**是网络程序所在的主机采用的通讯协族(AF_UNIX和AF_INET等)。
  - AF_UNIX只能够用于单一的Unix 系统进程间通信，而AF_INET是针对Internet的，因而可以允许远程通信使用。


- **type**是网络程序所采用的通讯协议(SOCK_STREAM,SOCK_DGRAM等)。

  - SOCK_STREAM表明用的是TCP 协议，这样会提供按顺序的，可靠，双向，面向连接的比特流。


  - SOCK_DGRAM 表明用的是UDP协议，这样只会提不可靠，无连接的通信。

- 关于**protocol**，由于指定了type，所以这个地方一般只要用0来代替就可以了。

此函数执行成功时返回文件描述符，失败时返回-1,看errno可知道出错的详细情况。

### 2.2 bind函数

```
int bind(int sockfd, struct sockaddr *my_addr, int addrlen);
```

从函数用于将地址绑定到一个套接字。

- **sockfd**是由socket函数调用返回的文件描述符。

- **my_addr**是一个指向sockaddr的指针。

- **addrlen**是sockaddr结构的长度。

sockaddr的定义：

```
struct sockaddr{
unisgned short  as_family;
char sa_data[14];
};
```

不过由于系统的兼容性,我们一般使用另外一个结构(struct sockaddr_in) 来代替。

sockaddr_in的定义：

```
struct sockaddr_in{
unsigned short   sin_family;     
unsigned short     sin_port;
struct in_addr   sin_addr;
unsigned char   sin_zero[8];
}
```

如果使用Internet所以sin_family一般为AF_INET。

- sin_addr设置为INADDR_ANY表示可以和任何的主机通信。


- sin_port是要监听的端口号。


- bind将本地的端口同socket返回的文件描述符捆绑在一起.成功是返回0,失败的情况和socket一样。


### 2.3 listen函数

```
int listen(int sockfd,int backlog);
```

此函数宣告服务器可以接受连接请求。

- **sockfd**是bind后的文件描述符。

- **backlog**设置请求排队的最大长度。当有多个客户端程序和服务端相连时，使用这个表示可以介绍的排队长度。

- listen函数将bind的文件描述符变为监听套接字，返回的情况和bind一样。


### 2.4 accept函数

```
int accept(int sockfd, struct sockaddr *addr,int *addrlen);
```

服务器使用此函数获得连接请求，并且建立连接。

- **sockfd**是listen后的文件描述符。

- **addr**，addrlen**是用来给客户端的程序填写的,服务器端只要传递指针就可以了， bind,listen和accept是服务器端用的函数。

- accept调用时，服务器端的程序会一直阻塞到有一个客户程序发出了连接。 accept成功时返回最后的服务器端的文件描述符，这个时候服务器端可以向该描述符写信息了，失败时返回-1 。


### 2.5 connect函数

```
int connect(int sockfd, struct sockaddr * serv_addr,int addrlen);
```

可以用connect建立一个连接，在connect中所指定的地址是想与之通信的服务器的地址。

- **sockfd**是socket函数返回的文件描述符。

- **serv_addr**储存了服务器端的连接信息，其中sin_add是服务端的地址。

- **addrlen**是serv_addr的长度 

- connect函数是客户端用来同服务端连接的.成功时返回0，sockfd是同服务端通讯的文件描述符，失败时返回-1。


### 2.6 send函数

```
ssize_t send(int sockfd, const void *buf, size_t len, int flags);
```

- **sockfd** 指定发送端套接字描述符；

- **buf** 指明一个存放应用程序要发送数据的缓冲区；

- **len** 指明实际要发送的数据的字节数；

- **flags** 一般置0。

- 客户或者服务器应用程序都用send函数来向TCP连接的另一端发送数据


### 2.7 recv函数

```
ssize_t recv(int sockfd, void *buf, size_t len, int flags);
```

- **sockfd** 指定接收端套接字描述符；

- **buf** 指明一个缓冲区，该缓冲区用来存放recv函数接收到的数据；

- **len** 指明buf的长度；

- **flags** 一般置0。

- 客户或者服务器应用程序都用recv函数从TCP连接的另一端接收数据。


### 2.8 recvfrom函数

**ssize_t recvfrom(int sockfd, void \*buf, size_t len, int flags,**

​            **struct sockaddr \*src_addr, socklen_t \*addrlen);**

- recvfrom通常用于无连接套接字，因为此函数可以获得发送者的地址。
- **src_addr** 是一个struct sockaddr类型的变量，该变量保存源机的IP地址及端口号。
- **addrlen** 常置为sizeof （struct sockaddr）。

### 2.9 sendto函数

```
ssize_t sendto(int sockfd, const void *buf, size_t len, int flags,
                      const struct sockaddr *dest_addr, socklen_t addrlen);
```

- sendto和send相似，区别在于sendto允许在无连接的套接字上指定一个目标地址。


- **dest_addr** 表示目地机的IP地址和端口号信息，

- **addrlen** 常常被赋值为sizeof （struct sockaddr）。

- **sendto** 函数也返回实际发送的数据字节长度或在出现发送错误时返回-1。

## 3 TCP编程

本节源码位于如下目录：

8_socket\01_tcp\

 

### 3.1 实现TCP server程序

以下是一个tcp_server.c服务器代码示例。

 

首先是初始化，代码如下：

```
19 #define SERVER_PORT 8888
20 #define BACKLOG     10
21
22 int main(int argc, char **argv)
23 {
24     int iSocketServer;
25     int iSocketClient;
26     struct sockaddr_in tSocketServerAddr;
27     struct sockaddr_in tSocketClientAddr;
28     int iRet;
29     int iAddrLen;
30
31     int iRecvLen;
32     unsigned char ucRecvBuf[1000];
33
34     int iClientNum = -1;
35
36     signal(SIGCHLD,SIG_IGN);
37
38     iSocketServer = socket(AF_INET, SOCK_STREAM, 0);
39     if (-1 == iSocketServer)
40     {
41         printf("socket error!\n");
42         return -1;
43     }
```

第38行，分配一个socket结构体，返回一个整数：以后使用这个整数引用这个结构体。

 

分配得到的socket结构体并没有含有IP、端口等信息，需要设置：

```
45     tSocketServerAddr.sin_family      = AF_INET;
46     tSocketServerAddr.sin_port        = htons(SERVER_PORT);  /* host to net, short */
47     tSocketServerAddr.sin_addr.s_addr = INADDR_ANY;
48     memset(tSocketServerAddr.sin_zero, 0, 8);
49
50     iRet = bind(iSocketServer, (const struct sockaddr *)&tSocketServerAddr, sizeof(struct sockaddr));
51     if (-1 == iRet)
52     {
53         printf("bind error!\n");
54         return -1;
55     }
```

第45~48行，设置一个sockaddr_in结构体，在里面填入本地IP、本地端口信息。

第50行，把前面设置的本地IP、本地端口信息跟之前分配的socket结构体“绑定起来”。

 

然后调用listen函数启动监听，代码如下：

```
57     iRet = listen(iSocketServer, BACKLOG);
58     if (-1 == iRet)
59     {
60         printf("listen error!\n");
61         return -1;
62     }
```

接着调用accept函数等待客户端发来连接请求，代码如下：

```
64     while (1)
65     {
66         iAddrLen = sizeof(struct sockaddr);
67         iSocketClient = accept(iSocketServer, (struct sockaddr *)&tSocketClientAddr, &iAddrLen);
68         if (-1 != iSocketClient)
69         {
```

如果有客户端连接成功，则为这个连接创建一个子进程，代码如下：

```
68         if (-1 != iSocketClient)
69         {
70             iClientNum++;
71             printf("Get connect from client %d : %s\n",  iClientNum, inet_ntoa(tSocketClientAddr.sin_addr));
72             if (!fork())
73             {
74                 /* 子进程的源码 */
75                 while (1)
76                 {
77                     /* 接收客户端发来的数据并显示出来 */
78                     iRecvLen = recv(iSocketClient, ucRecvBuf, 999, 0);
79                     if (iRecvLen <= 0)
80                     {
81                         close(iSocketClient);
82                         return -1;
83                     }
84                     else
85                     {
86                         ucRecvBuf[iRecvLen] = '\0';
87                         printf("Get Msg From Client %d: %s\n", iClientNum, ucRecvBuf);
88                     }
89                 }
90             }
```

第78行：子进程调用recv函数等待客户端发来数据。

第86、87行：打印接收到的数据。

 

执行以下指令编译：

```
gcc -o tcp_server tcp_server.c
```

 

### 3.2 实现TCP client程序

以下是一个tcp_client.c客户端代码示例。

 

首先是初始化，代码如下：

```
15 #define SERVER_PORT 8888
16
17 int main(int argc, char **argv)
18 {
19     int iSocketClient;
20     struct sockaddr_in tSocketServerAddr;
21
22     int iRet;
23     unsigned char ucSendBuf[1000];
24     int iSendLen;
25
26     if (argc != 2)
27     {
28         printf("Usage:\n");
29         printf("%s <server_ip>\n", argv[0]);
30         return -1;
31     }
32
33     iSocketClient = socket(AF_INET, SOCK_STREAM, 0);
```

第33行，分配一个socket结构体，返回一个整数：以后使用这个整数引用这个结构体。

 

作为客户单，你想连接哪个远端IP、远端端口？需要设置：

```
35     tSocketServerAddr.sin_family      = AF_INET;
36     tSocketServerAddr.sin_port        = htons(SERVER_PORT);  /* host to net, short */
37     //tSocketServerAddr.sin_addr.s_addr = INADDR_ANY;
38     if (0 == inet_aton(argv[1], &tSocketServerAddr.sin_addr))
39     {
40         printf("invalid server_ip\n");
41         return -1;
42     }
43     memset(tSocketServerAddr.sin_zero, 0, 8);
```

第35~43行，设置一个sockaddr_in结构体，在里面填入远端IP、远端端口信息。

 

接着调用connect函数链接刚刚设置的远端IP、远端端口，代码如下：

```
46     iRet = connect(iSocketClient, (const struct sockaddr *)&tSocketServerAddr, sizeof(struct sockaddr));
47     if (-1 == iRet)
48     {
49         printf("connect error!\n");
50         return -1;
51     }
```

最后，就可以不断给远端服务器发送数据了，代码如下：

```
53     while (1)
54     {
55         if (fgets(ucSendBuf, 999, stdin))
56         {
57             iSendLen = send(iSocketClient, ucSendBuf, strlen(ucSendBuf), 0);
58             if (iSendLen <= 0)
59             {
60                 close(iSocketClient);
61                 return -1;
62             }
63         }
64     }
```

第55行：读取用户输入的字符串。

第57行，把用户输入的字符串发送给服务器。

 

执行以下指令编译：

```
gcc tcp_client.c -o tcp_client
```

 

### 3.3 使用TCP进行消息传输

在TCP通信中，客户端与服务器之间建立连接后，可以通过这个连接传输数据。在上面的代码中，我们分别实现了TCP服务器和客户端的基本功能。

在开发板上执行如下命令，先启动服务器程序：

```
./tcp_server &
```

 

在同一个开发板上，执行如下命令启动客户端程序，并且输入字符串发送给服务器：

```
./tcp_client 127.0.0.1
Get connect from client 1 : 127.0.0.1
hello
Get Msg From Client 1: hello
```

 

## 4 UDP编程

本节源码位于如下目录：

8_socket\02_udp\

 

### 4.1 实现UDP server程序

udp_server.c程序核心源码如下：

```
45      iRet = bind(iSocketServer, (const struct sockaddr *)&tSocketServerAddr, sizeof(struct sockaddr)); //将套接字与特定的IP地址和端口号绑定
46      if (-1 == iRet)
47      {
48              printf("bind error!\n");
49              return -1;
50      }
51
52
53      while (1) //服务器将持续运行，等待客户端的消息
54      {
55              iAddrLen = sizeof(struct sockaddr);
56              iRecvLen = recvfrom(iSocketServer, ucRecvBuf, 999, 0, (struct sockaddr *)&tSocketClientAddr, &iAddrLen);// 接收客户端发送的消息
57              if (iRecvLen > 0)
58              {
59                      ucRecvBuf[iRecvLen] = '\0';
60                      printf("Get Msg From %s : %s\n", inet_ntoa(tSocketClientAddr.sin_addr), ucRecvBuf);
61              }
62      }
63
64      close(iSocketServer);
65      return 0;
66 }
```

 

### 4.2 实现UDP client程序

udp_client.c程序核心源码如下：

```
34      iSocketClient = socket(AF_INET, SOCK_DGRAM, 0);
35
36      tSocketServerAddr.sin_family      = AF_INET;
37      tSocketServerAddr.sin_port        = htons(SERVER_PORT);  /* host to net, short */
38      //tSocketServerAddr.sin_addr.s_addr = INADDR_ANY;
39      if (0 == inet_aton(argv[1], &tSocketServerAddr.sin_addr))
40      {
41              printf("invalid server_ip\n");
42              return -1;
43      }
44      memset(tSocketServerAddr.sin_zero, 0, 8);
45
46 #if 0
47      iRet = connect(iSocketClient, (const struct sockaddr *)&tSocketServerAddr, sizeof(struct sockaddr));
48      if (-1 == iRet)
49      {
50              printf("connect error!\n");
51              return -1;
52      }
53 #endif
54
55      while (1)
56      {
57              if (fgets(ucSendBuf, 999, stdin)) //从标准输入读取用户输入的数据。
58              {
59 #if 0
60                      iSendLen = send(iSocketClient, ucSendBuf, strlen(ucSendBuf), 0);
61 #else
62                      iAddrLen = sizeof(struct sockaddr);
63                      iSendLen = sendto(iSocketClient, ucSendBuf, strlen(ucSendBuf), 0,
64                                            (const struct sockaddr *)&tSocketServerAddr, iAddrLen);// 将数据通过UDP发送给服务器
```



### 4.3 使用TCP进行消息传输

先执行如下命令编译程序：

```
gcc -o udp_server udp_server.c
gcc -o udp_client udp_client.c
```

然后在开发板上执行如下命令，先启动服务器程序：

```
./udp_server &
```

在同一个开发板上，执行如下命令启动客户端程序，并且输入字符串发送给服务器：

```
./udp_client 127.0.0.1
hello
Get Msg From 127.0.0.1 : hello
```
