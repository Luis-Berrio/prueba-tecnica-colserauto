INSERT INTO vendedor (nombre, identificacion, email, telefono) VALUES
  ('Luis Berrio', '1065853001', 'luis.berrio@colserauto.test', '3105234567'),
  ('Isabella Corzo', '1067598452', 'isa.corzo@colserauto.test', '3005234567'),
  ('Andrés Torres', '1000000001', 'andres.torres@colserauto.test', '3000000001'),
  ('Gisela Luque', '77864678', 'gisela.luque@colserauto.test', '3151234567'),
  ('Carlos Ramírez', '1012345678', 'carlos.ramirez@colserauto.test', '3001234567');

INSERT INTO producto (codigo, nombre, descripcion, precio, stock) VALUES
  ('FIL-001', 'Filtro de aceite', 'Filtro de aceite para motor 1.6', 25000.00, 40),
  ('PAS-002', 'Pastillas de freno delanteras', 'Juego de pastillas de freno delanteras cerámicas', 89000.00, 25),
  ('BAT-003', 'Batería 12V', 'Batería 12V 45Ah libre de mantenimiento', 320000.00, 12),
  ('BUJ-004', 'Bujías de iridio', 'Juego de 4 bujías de iridio', 78000.00, 30),
  ('LIQ-005', 'Líquido de frenos DOT 4', 'Líquido de frenos DOT 4 de 500 ml', 18500.00, 60);

INSERT INTO venta (vendedor_id, producto_id, cantidad, precio_unitario, total) VALUES
  (1, 1, 2, 25000.00, 50000.00),
  (2, 3, 1, 320000.00, 320000.00),
  (3, 2, 1, 89000.00, 89000.00),
  (4, 4, 2, 78000.00, 156000.00),
  (5, 5, 3, 18500.00, 55500.00),
  (1, 2, 2, 89000.00, 178000.00);
