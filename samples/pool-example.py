#!python3

from multiprocessing import Pool
import os

def f(x):
    print('process id:', os.getpid())
    for i in range(10000000):
        x = x+1
        x = x-1
    return x*x

if __name__ == '__main__':
    with Pool(5) as p:
        print(p.map(f, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

