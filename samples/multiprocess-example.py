#!python3

from multiprocessing import Process
import os

def f(x):
    print('process id:', os.getpid())
    for i in range(10000000):
        x = x+1
        x = x-1
    print(x*x)

if __name__ == '__main__':
    ps = []
    for i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]:
        p = Process(target=f, args=(i,))
        p.start()
        ps.append(p)

    for p in  ps:
        p.join()

