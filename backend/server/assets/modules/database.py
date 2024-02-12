from sqlalchemy import create_engine, Column, Integer, String, Numeric, Boolean
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import select, desc, join, insert, and_, func, text


DATE_FORMAT_DEFAULT = '%Y-%m-%d %H:%M:%S'


DATABASE_URL = "sqlite:///./utils/data.db"  # Используем SQLite в качестве базы данных
engine = create_engine(DATABASE_URL, pool_size=20, max_overflow=-1)


Base = declarative_base()
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Pcs(Base):
    __tablename__ = "pcs"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique=True)
    name = Column(String, unique=True)
    status = Column(String)
    grid_id = Column(Integer, unique=True)
    ip = Column(String)
    blocked = Column(Integer, default=0)
    description = Column(String)


class Orders(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String)
    pc_id = Column(Integer)
    start = Column(String)
    pause = Column(String)
    finish = Column(String)
    price = Column(Numeric)
    payment = Column(String)
    status = Column(String)


class Storefront(Base):
    __tablename__ = "storefront"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True)
    qty = Column(Integer, nullable=False)
    price = Column(Numeric)
    hide = Column(Integer)


class Sold(Base):
    __tablename__ = "sold"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String)
    item_id = Column(Integer)
    qty = Column(Integer)
    total = Column(Numeric)
    payment = Column(String)
    sell_date = Column(String)


class Supplies(Base):
    __tablename__ = "supplies"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_id = Column(Integer)
    qty = Column(Integer)
    add_date = Column(String)


class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String, unique=True)
    name = Column(String, unique=True)
    login = Column(String, unique=True)
    password = Column(String)


class Sessions(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String)
    user_uuid = Column(String)
    start = Column(String)
    finish = Column(String)
    status = Column(String)


class WriteOff(Base):
    __tablename__ = "writeoff"
    id = Column(Integer, autoincrement=True, primary_key=True)
    user_uuid = Column(String)
    item_id = Column(Integer)
    qty = Column(Integer)
    type = Column(String)
    description = Column(String, nullable=True)
    wo_date = Column(String)


class Expenses(Base):
    __tablename__ = "expenses"
    id = Column(Integer, autoincrement=True, primary_key=True)
    user_uuid = Column(String)
    amount = Column(Numeric)
    reason = Column(String)
    date = Column(String)


class Cashout(Base):
    __tablename__ = "cashout"
    id = Column(Integer, autoincrement=True, primary_key=True)
    balance = Column(Numeric, default=0)
    hashed_password = Column(String)


class CashoutHistory(Base):
    __tablename__ = "cashout_history"
    id = Column(Integer, autoincrement=True, primary_key=True)
    old_value = Column(Numeric)
    new_value = Column(Numeric)
    reason = Column(String)
    edit_date = Column(String)


Base.metadata.create_all(bind=engine)


def create_default_devices():
    with Session() as db:
        pc_arr = []
        for i in range(1,32):
            if i != 31:
                name = f'PC-{i}'
            else:
                name = 'PS5'
            pc = Pcs(name=name, status="online", grid_id=(i-1))
            pc_arr.append(pc)
            stmt = insert(Pcs).values(name=name, status='online', grid_id=(i-1)).prefix_with('OR IGNORE', dialect="sqlite")
            db.execute(stmt)
        db.commit()


def create_balance():
    with Session() as db:
        stmt = insert(Cashout).values(balance=0, id=1, hashed_password='$2b$12$Bi2/iist8TgLRlrIs7WzRu000FO8dY5fttV9gun/Bxq2OeBonaENG').prefix_with('OR IGNORE', dialect="sqlite")
        db.execute(stmt)
        db.commit()


create_default_devices()
create_balance()
