# give amount of lines in out.txt

def main():
    with open('out.txt') as f:
        print(len(f.readlines()))

if __name__ == '__main__':
    main()